import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";
import { Resend } from 'resend';

// Use RESEND_API_KEY in production (server-only). Fallback for dev if you use NEXT_PUBLIC_*.
const resend = new Resend(process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const auth = betterAuth({
  // Required for prod: set BETTER_AUTH_URL to your production URL (e.g. https://yourdomain.com)
  // so password reset and verification emails contain correct links.
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      // Use void to avoid awaiting and prevent timing attacks
      // On serverless platforms, waitUntil ensures email is sent without blocking response
      const emailPromise = resend.emails.send({
        from: 'info@servaldesigns.com',
        to: user.email,
        subject: 'Reset your password',
        html: `<a href="${url}">Reset your password</a>`
      });

      // Use waitUntil if available (Next.js serverless/edge runtime)
      if (request && 'waitUntil' in request && typeof request.waitUntil === 'function') {
        request.waitUntil(emailPromise);
      } else {
        // Fallback: use void to not await (prevents timing attacks)
        void emailPromise;
      }
    },
    
    requireEmailVerification: true, // Require email verification before allowing login
  },
  emailVerification: {
    sendOnSignUp: true, // Automatically send verification email on sign up
    autoSignInAfterVerification: true,
    // Custom email sending function - you need to configure an email service
    // For now, this will log the verification URL in development
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // Use void to avoid awaiting and prevent timing attacks
      // On serverless platforms, waitUntil ensures email is sent without blocking response
      const emailPromise = resend.emails.send({
        from: 'info@servaldesigns.com',
        to: user.email,
        subject: 'Verify your email',
        html: `<a href="${url}">Verify Email</a>`
      });

      // Use waitUntil if available (Next.js serverless/edge runtime)
      if (request && 'waitUntil' in request && typeof request.waitUntil === 'function') {
        request.waitUntil(emailPromise);
      } else {
        // Fallback: use void to not await (prevents timing attacks)
        void emailPromise;
      }
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