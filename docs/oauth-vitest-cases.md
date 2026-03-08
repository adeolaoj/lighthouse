# OAuth Vitest Cases (R4)

Environment targeted: `frontend` local test run (`npm test -- --run`).

## Covered test cases

1. Successful login
- File: `frontend/src/hooks/auth.test.ts`
- Verifies Google sign-in is invoked and user is redirected to `/results` on success.

2. Cancelled login
- File: `frontend/src/hooks/auth.test.ts`
- Verifies OAuth cancellation does not crash the flow, returns a non-breaking user-safe message, and routes user to `/login` with error context.

3. Session persistence
- File: `frontend/src/hooks/auth.test.ts`
- Verifies token storage/retrieval persists across simulated refresh and is visible across tabs via shared `localStorage`.

4. Unauthorized route access
- File: `frontend/src/middleware.test.ts`
- Verifies unauthenticated users are redirected to `/login` when requesting `/results*`.

## Notes

- Middleware tests also verify authenticated access to protected routes and unauthenticated access to public routes remain non-redirecting.
- In the current sandbox, Vitest worker startup is blocked with `spawn EPERM`; run the same commands in a normal local shell or CI/staging to record passing execution.
