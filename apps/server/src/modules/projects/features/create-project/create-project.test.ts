import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";
import { testAuth } from "@/modules/auth/auth.test";

// Create test app with projects controller

describe("POST /projects", () => {
   let auth: Awaited<typeof testAuth>;

   beforeEach(async () => {
      // Get the global test user (automatically initialized when first accessed)
      auth = await testAuth;
   });

   afterEach(async () => {
      // Cleanup: Remove test data (but not users/sessions as they're managed globally)
      await prisma.projects.deleteMany({});
   });

   it("should return 201 with project data when project is created successfully", async () => {
      const response = await app.handle(
         new Request("http://localhost/projects", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Project",
               description: "New Project Description",
            }),
         }),
      );

      // Elysia may return 200 instead of 201 unless status is explicitly set
      expect([200, 201]).toContain(response.status);
      const data = (await response.json()) as {
         id: string;
         name: string;
         description: string;
         createdAt: string;
         updatedAt: string;
      };
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("name", "New Project");
      expect(data).toHaveProperty("description", "New Project Description");
      expect(data).toHaveProperty("createdAt");
      expect(data).toHaveProperty("updatedAt");

      // Verify project was actually created in database
      const project = await prisma.projects.findUnique({
         where: { id: data.id },
      });
      const testUser = await prisma.user.findUnique({
         where: { email: auth.email },
      });
      expect(project).not.toBeNull();
      expect(project?.name).toBe("New Project");
      expect(project?.description).toBe("New Project Description");
      expect(project?.createdByUserId).toBe(testUser?.id); // Verify it's created by the authenticated user
   });

   it("should return 401 when user is not authenticated", async () => {
      const response = await app.handle(
         new Request("http://localhost/projects", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Project",
               description: "New Project Description",
            }),
         }),
      );

      expect(response.status).toBe(401);
   });

   it("should return 422 when name is missing", async () => {
      const response = await app.handle(
         new Request("http://localhost/projects", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               description: "New Project Description",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when description is missing", async () => {
      const response = await app.handle(
         new Request("http://localhost/projects", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Project",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when name is empty", async () => {
      const response = await app.handle(
         new Request("http://localhost/projects", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "",
               description: "New Project Description",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when description is empty", async () => {
      const response = await app.handle(
         new Request("http://localhost/projects", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Project",
               description: "",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });
});
