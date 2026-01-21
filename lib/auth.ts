import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Require email verification before allowing login
  },
  emailVerification: {
    sendOnSignUp: true, // Automatically send verification email on sign up
    autoSignInAfterVerification: true,
    // Custom email sending function - you need to configure an email service
    // For now, this will log the verification URL in development
    sendVerificationEmail: async ({ user, url, token }) => {
      // TODO: Replace this with your email service (Resend, SendGrid, SMTP, etc.)
      // In development, log the URL to console for testing
      if (process.env.NODE_ENV === "development") {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📧 Email Verification Required");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("To:", user.email);
        console.log("Verification URL:", url);
        console.log("Token:", token);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      } else {
        // In production, you must configure an email service
        console.error(
          "⚠️ Email service not configured! User cannot verify email:",
          user.email
        );
        console.error("Verification URL:", url);
        // Example with Resend:
        // import { Resend } from 'resend';
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //   from: 'noreply@yourdomain.com',
        //   to: user.email,
        //   subject: 'Verify your email',
        //   html: `<a href="${url}">Verify Email</a>`
        // });
      }
      
      // Don't throw - let the signup succeed, but email won't be sent
      // This allows testing without email service configured
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()],
  
});