import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Google],

  session: {
    totalDurationMs: 60 * 1000 * 7 * 24 * 60, // 7 days in milliseconds
  },
});