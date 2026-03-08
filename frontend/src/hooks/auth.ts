// use client means this file will be bundled and run in the browser, not on the server
// this is because it uses hooks from the auth library, which rely on browser APIs like cookies and local storage
"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const OAUTH_CANCEL_MESSAGE = "Google sign-in was cancelled. Please try again.";

type LoginResult =
  | { ok: true }
  | { ok: false; message: string };

export function useAuth() {
  const { signIn, signOut } = useAuthActions();
  const router = useRouter();
  const params = useSearchParams();

  const redirect = params?.get("redirect") || "/";

  const login = async (): Promise<LoginResult> => {
    try {
      await signIn("google");
      router.push(redirect);
      return { ok: true };
    } catch {
      router.push(`/login?error=${encodeURIComponent(OAUTH_CANCEL_MESSAGE)}`);
      return { ok: false, message: OAUTH_CANCEL_MESSAGE };
    }
  };

  const logout = async () => {
    await signOut();
    router.push("/login");
  };

  return { login, logout, oauthCancelMessage: OAUTH_CANCEL_MESSAGE };
}
