import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string,
        }
      }
    }),
  ],

  session: {
    totalDurationMs: 60 * 1000 * 30, // 30 minutes in milliseconds
  },
});
