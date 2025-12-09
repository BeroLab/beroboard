import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";
import { createAdditionalTestUser, testAuth } from "@/modules/auth/auth.test";

describe("PATCH /boards/:id", () => {
   let auth: Awaited<typeof testAuth>;
   let otherUser: { sessionCookie: string; userId: string };
   let testProject: Awaited<ReturnType<typeof prisma.projects.create>>;
   let testBoard: Awaited<ReturnType<typeof prisma.boards.create>>;

   beforeEach(async () => {
      // Get the global test user (automatically initialized when first accessed)
      auth = await testAuth;

      // Create an additional user for testing authorization
      const otherUserEmail = `other-${Date.now()}@example.com`;
      otherUser = await createAdditionalTestUser(otherUserEmail, "password123", "Other User");

      // Get the test user ID from auth
      const testUser = await prisma.user.findUnique({
         where: { email: auth.email },
      });

      if (!testUser) {
         throw new Error("Failed to find test user");
      }

      // Create organization via API
      const orgName = `Test Org ${Date.now()}`;
      const orgSlug = `test-org-${Date.now()}`;
      const orgResponse = await app.handle(
         new Request("http://localhost/api/auth/organization/create", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               cookie: auth.sessionCookie,
            },
            body: JSON.stringify({
               name: orgName,
               slug: orgSlug,
            }),
         }),
      );

      if (orgResponse.status !== 200 && orgResponse.status !== 201) {
         const errorText = await orgResponse.text();
         throw new Error(`Failed to create organization (status ${orgResponse.status}): ${errorText}`);
      }

      const orgData = (await orgResponse.json()) as { data?: { id: string }; id?: string };
      let orgId = orgData?.data?.id || orgData?.id;
      if (!orgId) {
         const org = await prisma.organization.findUnique({
            where: { slug: orgSlug },
            select: { id: true },
         });
         if (!org) {
            throw new Error("Failed to create organization: no ID returned");
         }
         orgId = org.id;
      }

      // Create test project linked to organization
      testProject = await prisma.projects.create({
         data: {
            id: `test-project-${Date.now()}`,
            name: "Test Project",
            description: "Test Description",
            createdByUser: {
               connect: { id: testUser.id },
            },
            organization: {
               connect: { id: orgId },
            },
            createdAt: new Date(),
            updatedAt: new Date(),
         },
      });

      // Create test board in the project
      testBoard = await prisma.boards.create({
         data: {
            id: `test-board-${Date.now()}`,
            name: "Test Board",
            description: "Test Board Description",
            projectId: testProject.id,
            createdAt: new Date(),
            updatedAt: new Date(),
         },
      });
   });

   afterEach(async () => {
      // Cleanup: Remove test data (but not users/sessions as they're managed globally)
      // Delete in order to respect foreign key constraints
      await prisma.boards.deleteMany({});
      await prisma.projects.deleteMany({});
      await prisma.member.deleteMany({});
      await prisma.organization.deleteMany({});
      await prisma.invitation.deleteMany({});
   });

   it("should return 200 with updated board data when updating both name and description", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards/${testBoard.id}`, {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Updated Board Name",
               description: "Updated Description",
            }),
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
         name: string;
         description: string;
         createdAt: string;
         updatedAt: string;
      };
      expect(data).toHaveProperty("name", "Updated Board Name");
      expect(data).toHaveProperty("description", "Updated Description");
      expect(data).toHaveProperty("createdAt");
      expect(data).toHaveProperty("updatedAt");

      // Verify board was actually updated in database
      const updatedBoard = await prisma.boards.findUnique({
         where: { id: testBoard.id },
      });
      expect(updatedBoard).not.toBeNull();
      expect(updatedBoard?.name).toBe("Updated Board Name");
      expect(updatedBoard?.description).toBe("Updated Description");
   });

   it("should return 200 with updated board data when updating only name", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards/${testBoard.id}`, {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Updated Name Only",
            }),
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
         name: string;
         description: string;
      };
      expect(data).toHaveProperty("name", "Updated Name Only");
      expect(data).toHaveProperty("description", "Test Board Description"); // Original description should remain

      // Verify board was actually updated in database
      const updatedBoard = await prisma.boards.findUnique({
         where: { id: testBoard.id },
      });
      expect(updatedBoard).not.toBeNull();
      expect(updatedBoard?.name).toBe("Updated Name Only");
      expect(updatedBoard?.description).toBe("Test Board Description");
   });

   it("should return 200 with updated board data when updating only description", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards/${testBoard.id}`, {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               description: "Updated Description Only",
            }),
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
         name: string;
         description: string;
      };
      expect(data).toHaveProperty("name", "Test Board"); // Original name should remain
      expect(data).toHaveProperty("description", "Updated Description Only");

      // Verify board was actually updated in database
      const updatedBoard = await prisma.boards.findUnique({
         where: { id: testBoard.id },
      });
      expect(updatedBoard).not.toBeNull();
      expect(updatedBoard?.name).toBe("Test Board");
      expect(updatedBoard?.description).toBe("Updated Description Only");
   });

   it("should return 200 with unchanged board data when no fields are provided", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards/${testBoard.id}`, {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
         name: string;
         description: string;
      };
      expect(data).toHaveProperty("name", "Test Board");
      expect(data).toHaveProperty("description", "Test Board Description");
   });

   it("should return 401 when user is not authenticated", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards/${testBoard.id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Updated Name",
            }),
         }),
      );

      expect(response.status).toBe(401);
   });

   it("should return 403 when user does not have permission to update the board", async () => {
      // Create an isolated project that otherUser doesn't have access to
      const testUser = await prisma.user.findUnique({
         where: { email: auth.email },
      });
      if (!testUser) {
         throw new Error("Failed to find test user");
      }

      // Create isolated organization
      const isolatedOrgSlug = `isolated-org-${Date.now()}`;
      const isolatedOrgResponse = await app.handle(
         new Request("http://localhost/api/auth/organization/create", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               cookie: auth.sessionCookie,
            },
            body: JSON.stringify({
               name: "Isolated Org",
               slug: isolatedOrgSlug,
            }),
         }),
      );

      if (isolatedOrgResponse.status !== 200 && isolatedOrgResponse.status !== 201) {
         throw new Error("Failed to create isolated organization");
      }

      const isolatedOrgData = (await isolatedOrgResponse.json()) as { data?: { id: string }; id?: string };
      let isolatedOrgId = isolatedOrgData?.data?.id || isolatedOrgData?.id;
      if (!isolatedOrgId) {
         const org = await prisma.organization.findUnique({
            where: { slug: isolatedOrgSlug },
            select: { id: true },
         });
         if (!org) {
            throw new Error("Failed to create isolated organization");
         }
         isolatedOrgId = org.id;
      }

      const isolatedProject = await prisma.projects.create({
         data: {
            id: `isolated-project-${Date.now()}`,
            name: "Isolated Project",
            description: "Isolated Description",
            createdByUser: {
               connect: { id: testUser.id },
            },
            organization: {
               connect: { id: isolatedOrgId },
            },
            createdAt: new Date(),
            updatedAt: new Date(),
         },
      });

      const isolatedBoard = await prisma.boards.create({
         data: {
            id: `isolated-board-${Date.now()}`,
            name: "Isolated Board",
            description: "Isolated Board Description",
            projectId: isolatedProject.id,
            createdAt: new Date(),
            updatedAt: new Date(),
         },
      });

      // Try to update with otherUser (who doesn't have access to isolatedBoard)
      const response = await app.handle(
         new Request(`http://localhost/boards/${isolatedBoard.id}`, {
            method: "PATCH",
            headers: {
               cookie: otherUser.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Unauthorized Update",
            }),
         }),
      );

      expect(response.status).toBe(403);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
      expect(data.message).toContain("not allowed");

      // Cleanup isolated test data
      await prisma.boards.delete({ where: { id: isolatedBoard.id } });
      await prisma.projects.delete({ where: { id: isolatedProject.id } });
      await prisma.organization.delete({ where: { id: isolatedOrgId } });
   });

   it("should return 404 when board does not exist", async () => {
      const response = await app.handle(
         new Request("http://localhost/boards/non-existent-board-id", {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Updated Name",
            }),
         }),
      );

      expect(response.status).toBe(404);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
   });

   it("should return 404 or 422 when id is missing or empty", async () => {
      // The route pattern /:id doesn't match /boards/, so it returns 404
      // But validation might return 422 for empty id
      const response = await app.handle(
         new Request("http://localhost/boards/", {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Updated Name",
            }),
         }),
      );

      // Elysia returns 404 when route doesn't match or 422 for validation
      expect([404, 422]).toContain(response.status);
   });
});
