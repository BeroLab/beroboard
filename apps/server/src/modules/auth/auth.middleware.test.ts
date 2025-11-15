import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import type { Session } from "@beroboard/auth";
import { auth } from "@beroboard/auth";
import type { Role } from "@beroboard/auth/roles";
import { Elysia } from "elysia";
import { authMiddleware } from "./auth.middleware";

/**
 * Helper function to create a mock session as it would be returned by better-auth
 * from the database. This ensures our tests match the real data structure that
 * better-auth returns when querying Prisma.
 *
 * This simulates what better-auth returns when it queries the database through Prisma,
 * ensuring our tests validate the middleware works with real database responses.
 */
function createMockSessionFromDb(user: {
   id: string;
   name: string;
   email: string;
   emailVerified: boolean;
   role: Role;
   image?: string | null;
   createdAt: Date;
   updatedAt: Date;
}): Session {
   return {
      user: {
         id: user.id,
         name: user.name,
         email: user.email,
         emailVerified: user.emailVerified,
         role: user.role,
         image: user.image ?? null,
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
      },
      session: {
         id: "session-id",
         expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
         token: "session-token",
         createdAt: new Date(),
         updatedAt: new Date(),
         ipAddress: null,
         userAgent: null,
         userId: user.id,
      },
   } as Session;
}

describe("authMiddleware", () => {
   let getSessionSpy: ReturnType<typeof spyOn>;

   beforeEach(() => {
      // Mock auth.api.getSession to simulate what better-auth returns from the database
      // In production, better-auth queries Prisma and returns this structure
      getSessionSpy = spyOn(auth.api, "getSession").mockResolvedValue(null);
   });

   afterEach(() => {
      getSessionSpy.mockRestore();
   });

   it("returns 401 when no session is found", async () => {
      getSessionSpy.mockResolvedValueOnce(null);

      const app = new Elysia().use(authMiddleware).get("/protected", ({ user }) => user, {
         auth: true,
      });

      const response = await app.handle(new Request("http://localhost/protected"));

      expect(response.status).toBe(401);
      const text = await response.text();
      expect(text).toBe("User not authorized");
   });

   it("returns 401 when session has no user", async () => {
      getSessionSpy.mockResolvedValueOnce({} as Session);

      const app = new Elysia().use(authMiddleware).get("/protected", ({ user }) => user, {
         auth: true,
      });

      const response = await app.handle(new Request("http://localhost/protected"));

      expect(response.status).toBe(401);
      const text = await response.text();
      expect(text).toBe("User not authorized");
   });

   it("allows access when auth is true and user has valid role", async () => {
      // Simulate what better-auth returns from database query
      const validSession = createMockSessionFromDb({
         id: "123",
         name: "Test User",
         email: "test@example.com",
         emailVerified: true,
         role: "USER",
         createdAt: new Date(),
         updatedAt: new Date(),
      });

      getSessionSpy.mockResolvedValueOnce(validSession);

      const app = new Elysia().use(authMiddleware).get("/protected", ({ user }) => ({ userId: user.id, role: user.role }), {
         auth: true,
      });

      const response = await app.handle(new Request("http://localhost/protected"));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ userId: "123", role: "USER" });
   });

   it("allows access when user role matches required role (USER)", async () => {
      const userSession = createMockSessionFromDb({
         id: "123",
         name: "Test User",
         email: "test@example.com",
         emailVerified: true,
         role: "USER",
         createdAt: new Date(),
         updatedAt: new Date(),
      });

      getSessionSpy.mockResolvedValueOnce(userSession);

      const app = new Elysia().use(authMiddleware).get("/user-only", ({ user }) => ({ userId: user.id, role: user.role }), {
         auth: "USER",
      });

      const response = await app.handle(new Request("http://localhost/user-only"));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ userId: "123", role: "USER" });
   });

   it("allows access when user role matches required role (ADMIN)", async () => {
      const adminSession = createMockSessionFromDb({
         id: "456",
         name: "Admin User",
         email: "admin@example.com",
         emailVerified: true,
         role: "ADMIN",
         createdAt: new Date(),
         updatedAt: new Date(),
      });

      getSessionSpy.mockResolvedValueOnce(adminSession);

      const app = new Elysia().use(authMiddleware).get("/admin-only", ({ user }) => ({ userId: user.id, role: user.role }), {
         auth: "ADMIN",
      });

      const response = await app.handle(new Request("http://localhost/admin-only"));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ userId: "456", role: "ADMIN" });
   });

   it("returns 401 when user role does not match required role (USER trying to access ADMIN)", async () => {
      const userSession = createMockSessionFromDb({
         id: "123",
         name: "Test User",
         email: "test@example.com",
         emailVerified: true,
         role: "USER",
         createdAt: new Date(),
         updatedAt: new Date(),
      });

      getSessionSpy.mockResolvedValueOnce(userSession);

      const app = new Elysia().use(authMiddleware).get("/admin-only", ({ user }) => user, {
         auth: "ADMIN",
      });

      const response = await app.handle(new Request("http://localhost/admin-only"));

      expect(response.status).toBe(401);
      const text = await response.text();
      expect(text).toBe("User not authorized");
   });

   it("returns 401 when user role does not match required role (ADMIN trying to access USER)", async () => {
      const adminSession = createMockSessionFromDb({
         id: "456",
         name: "Admin User",
         email: "admin@example.com",
         emailVerified: true,
         role: "ADMIN",
         createdAt: new Date(),
         updatedAt: new Date(),
      });

      getSessionSpy.mockResolvedValueOnce(adminSession);

      const app = new Elysia().use(authMiddleware).get("/user-only", ({ user }) => user, {
         auth: "USER",
      });

      const response = await app.handle(new Request("http://localhost/user-only"));

      expect(response.status).toBe(401);
      const text = await response.text();
      expect(text).toBe("User not authorized");
   });

   it("passes session and user to route handler", async () => {
      const validSession = createMockSessionFromDb({
         id: "123",
         name: "Test User",
         email: "test@example.com",
         emailVerified: true,
         role: "USER",
         createdAt: new Date(),
         updatedAt: new Date(),
      });

      getSessionSpy.mockResolvedValueOnce(validSession);

      const app = new Elysia().use(authMiddleware).get(
         "/protected",
         ({ user, session }) => ({
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            sessionExists: !!session,
         }),
         {
            auth: true,
         },
      );

      const response = await app.handle(new Request("http://localhost/protected"));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({
         userId: "123",
         userName: "Test User",
         userRole: "USER",
         sessionExists: true,
      });
   });

   it("calls getSession with correct headers", async () => {
      const validSession = createMockSessionFromDb({
         id: "123",
         name: "Test User",
         email: "test@example.com",
         emailVerified: true,
         role: "USER",
         createdAt: new Date(),
         updatedAt: new Date(),
      });

      getSessionSpy.mockResolvedValueOnce(validSession);

      const app = new Elysia().use(authMiddleware).get("/protected", () => "ok", {
         auth: true,
      });

      const request = new Request("http://localhost/protected", {
         headers: {
            cookie: "session=abc123",
            authorization: "Bearer token123",
         },
      });

      await app.handle(request);

      expect(getSessionSpy).toHaveBeenCalledTimes(1);
      expect(getSessionSpy).toHaveBeenCalledWith({
         headers: expect.objectContaining({
            cookie: "session=abc123",
            authorization: "Bearer token123",
         }),
      });
   });
});
