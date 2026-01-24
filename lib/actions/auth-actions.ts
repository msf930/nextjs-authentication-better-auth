"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";
import { ensureUserHasCollection } from "../collection";

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name, 
        callbackURL: "/dashboard",
      },
    });

    if (result.user) {
      await ensureUserHasCollection(result.user.id);
    }

    return result;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: "/dashboard",
      },
    });

    if (result.user) {
      await ensureUserHasCollection(result.user.id);
    }

    return result;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  return result;
};

export const signInSocial = async (provider: "github" | "google") => {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: "/dashboard",
    },
  });
  if (url) {
    redirect(url);
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const result = await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: "/auth/reset-password",
      },
    });

    return result;
  } catch (error) {
    console.error("Password reset request error:", error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const result = await auth.api.resetPassword({
      body: {
        token,
        newPassword,
      },
    });

    return result;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};