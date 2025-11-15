import { auth } from "@beroboard/auth";
import { app } from "@/index";

// Create a test app instance that includes auth routes (without .listen())
const testApp = app;

type TestAuth = {
   app: typeof testApp;
   sessionCookie: string;
   email: string;
   userId: string;
};

let cachedTestAuth: TestAuth | null = null;
let testAuthPromise: Promise<TestAuth> | null = null;

/**
 * Initialize the global test authentication setup.
 * This creates a real user through better-auth endpoints and stores the session cookie.
 * The user is created only once and reused across all tests.
 *
 * @returns TestAuth object containing the app instance, session cookie, and user email
 */
async function initializeTestAuth(): Promise<TestAuth> {
   if (cachedTestAuth) return cachedTestAuth;

   // Create unique email for test user
   const email = `test-user-${Date.now()}@example.com`;
   const password = "test-password-123";
   const name = "Test User";

   // 1. Sign up a new user
   const signUpResponse = await testApp.handle(
      new Request("http://localhost/api/auth/sign-up/email", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email, password, name }),
      }),
   );

   if (signUpResponse.status !== 200 && signUpResponse.status !== 201) {
      const errorText = await signUpResponse.text();
      throw new Error(`Failed to create test user (status ${signUpResponse.status}): ${errorText}`);
   }

   // 2. Sign in to get session cookie
   const signInResponse = await testApp.handle(
      new Request("http://localhost/api/auth/sign-in/email", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email, password }),
      }),
   );

   if (signInResponse.status !== 200) {
      const errorText = await signInResponse.text();
      throw new Error(`Failed to sign in test user: ${errorText}`);
   }

   // 3. Extract session cookie from response
   const setCookieHeader = signInResponse.headers.get("set-cookie");
   if (!setCookieHeader) {
      throw new Error("No session cookie returned from sign-in");
   }

   // 4. Get user ID from session
   const session = (await auth.api.getSession({
      headers: {
         cookie: setCookieHeader,
      },
   })) as { user?: { id: string } } | null;

   if (!session?.user?.id) {
      throw new Error("Failed to get user ID from session");
   }

   cachedTestAuth = {
      app: testApp,
      sessionCookie: setCookieHeader,
      email,
      userId: session.user.id,
   };

   return cachedTestAuth;
}

/**
 * Get or create a global test authentication setup.
 * This creates a real user through better-auth endpoints and stores the session cookie.
 * The user is created only once and reused across all tests.
 *
 * @returns TestAuth object containing the app instance, session cookie, and user email
 */
export async function getTestAuth(): Promise<TestAuth> {
   if (cachedTestAuth) return cachedTestAuth;
   if (!testAuthPromise) {
      testAuthPromise = initializeTestAuth();
   }
   return testAuthPromise;
}

/**
 * Global test authentication - automatically initialized when first accessed.
 * Use this in your tests by awaiting it or using it in beforeEach hooks.
 *
 * @example
 * ```typescript
 * import { testAuth } from "@/modules/auth/auth.test";
 *
 * describe("My Feature", () => {
 *    it("should work", async () => {
 *       const auth = await testAuth;
 *       // Use auth.sessionCookie
 *    });
 * });
 * ```
 */
export const testAuth: Promise<TestAuth> = (async () => {
   if (!testAuthPromise) {
      testAuthPromise = initializeTestAuth();
   }
   return testAuthPromise;
})();

/**
 * Create an additional authenticated user for testing scenarios that require multiple users.
 * This is useful for testing authorization scenarios (e.g., user A cannot access user B's resources).
 *
 * @param email - Unique email for the user
 * @param password - Password for the user
 * @param name - Name for the user
 * @returns Object with session cookie and user ID
 */
export async function createAdditionalTestUser(email: string, password: string, name: string): Promise<{ sessionCookie: string; userId: string }> {
   // 1. Sign up a new user
   const signUpResponse = await testApp.handle(
      new Request("http://localhost/api/auth/sign-up/email", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email, password, name }),
      }),
   );

   if (signUpResponse.status !== 200 && signUpResponse.status !== 201) {
      const errorText = await signUpResponse.text();
      throw new Error(`Failed to create additional user (status ${signUpResponse.status}): ${errorText}`);
   }

   // 2. Sign in to get session cookie
   const signInResponse = await testApp.handle(
      new Request("http://localhost/api/auth/sign-in/email", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email, password }),
      }),
   );

   if (signInResponse.status !== 200) {
      const errorText = await signInResponse.text();
      throw new Error(`Failed to sign in additional user: ${errorText}`);
   }

   // 3. Extract session cookie from response
   const setCookieHeader = signInResponse.headers.get("set-cookie");
   if (!setCookieHeader) {
      throw new Error("No session cookie returned from sign-in");
   }

   // 4. Get user ID from session
   const session = (await auth.api.getSession({
      headers: {
         cookie: setCookieHeader,
      },
   })) as { user?: { id: string } } | null;

   if (!session?.user?.id) {
      throw new Error("Failed to get user ID from session");
   }

   return {
      sessionCookie: setCookieHeader,
      userId: session.user.id,
   };
}
