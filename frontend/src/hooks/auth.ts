// use client means this file will be bundled and run in the browser, not on the server
// this is because it uses hooks from the auth library, which rely on browser APIs like cookies and local storage
"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export function useAuth() {
  const { signIn, signOut } = useAuthActions();
  const router = useRouter();
  const params = useSearchParams();

  const redirect = params?.get("redirect") || "/";

  const login = async () => {
    await signIn("google");
    router.push(redirect);
  };

  const logout = async () => {
    await signOut();
    router.push("/login");
  };

  return {login, logout};
}