import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";
import { createAdditionalTestUser, testAuth } from "@/modules/auth/auth.test";

describe("GET /boards", () => {
   let auth: Awaited<typeof testAuth>;
   let otherUser: { sessionCookie: string; userId: string };
   let testProject: Awaited<ReturnType<typeof prisma.projects.create>>;
   let testBoard1: Awaited<ReturnType<typeof prisma.boards.create>>;
   let testBoard2: Awaited<ReturnType<typeof prisma.boards.create>>;

   beforeEach(async () => {
      // Get the global test user (automatically initialized when first accessed)
      auth = await testAuth;

      // Create an additional user for testing authorization
      const otherUserEmail = `other-${Date.now()}@example.com`;
      otherUser = await createAdditionalTestUser(otherUserEmail, "password123", "Other User");

      // Create test project via API to ensure proper setup with organization
      const projectResponse = await app.handle(
         new Request("http://localhost/projects", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Test Project",
               description: "Test Description",
            }),
         }),
      );

      if (projectResponse.status !== 200 && projectResponse.status !== 201) {
         const errorText = await projectResponse.text();
         throw new Error(`Failed to create project (status ${projectResponse.status}): ${errorText}`);
      }

      const projectData = (await projectResponse.json()) as { id: string };
      testProject = await prisma.projects.findUnique({
         where: { id: projectData.id },
      });

      if (!testProject) {
         throw new Error("Failed to find created project");
      }

      // Create test boards in the project
      testBoard1 = await prisma.boards.create({
         data: {
            id: `test-board-1-${Date.now()}`,
            name: "Test Board 1",
            description: "Test Board Description 1",
            projectId: testProject.id,
            createdAt: new Date(),
            updatedAt: new Date(),
         },
      });

      testBoard2 = await prisma.boards.create({
         data: {
            id: `test-board-2-${Date.now()}`,
            name: "Test Board 2",
            description: "Test Board Description 2",
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

   it("should return 200 with boards array when project has boards and user has permission", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as Array<{
         id: string;
         name: string;
         description: string;
         projectId: string;
         createdAt: string;
         updatedAt: string;
         deletedAt: string | null;
      }>;
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(2);

      // Verify boards are in the response
      const boardIds = data.map((b) => b.id);
      expect(boardIds).toContain(testBoard1.id);
      expect(boardIds).toContain(testBoard2.id);

      // Verify board structure
      const board1 = data.find((b) => b.id === testBoard1.id);
      expect(board1).toBeDefined();
      expect(board1?.name).toBe("Test Board 1");
      expect(board1?.description).toBe("Test Board Description 1");
      expect(board1?.projectId).toBe(testProject.id);
      expect(board1).toHaveProperty("createdAt");
      expect(board1).toHaveProperty("updatedAt");
   });

   it("should return 200 with empty array when project has no boards", async () => {
      // Create a new project with no boards
      const newProjectResponse = await app.handle(
         new Request("http://localhost/projects", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Empty Project",
               description: "Empty Description",
            }),
         }),
      );

      if (newProjectResponse.status !== 200 && newProjectResponse.status !== 201) {
         throw new Error("Failed to create new project");
      }

      const newProjectData = (await newProjectResponse.json()) as { id: string };

      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${newProjectData.id}`, {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as Array<unknown>;
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
   });

   it("should return 401 when user is not authenticated", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "GET",
         }),
      );

      expect(response.status).toBe(401);
   });

   it("should return 403 when user does not have permission to get boards for the project", async () => {
      // Create an isolated project that otherUser doesn't have access to
      const isolatedProjectResponse = await app.handle(
         new Request("http://localhost/projects", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Isolated Project",
               description: "Isolated Description",
            }),
         }),
      );

      if (isolatedProjectResponse.status !== 200 && isolatedProjectResponse.status !== 201) {
         throw new Error("Failed to create isolated project");
      }

      const isolatedProjectData = (await isolatedProjectResponse.json()) as { id: string };
      const isolatedProject = await prisma.projects.findUnique({
         where: { id: isolatedProjectData.id },
      });

      if (!isolatedProject) {
         throw new Error("Failed to find isolated project");
      }

      // Try to get boards with otherUser (who doesn't have access to isolatedProject)
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${isolatedProject.id}`, {
            method: "GET",
            headers: {
               cookie: otherUser.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(403);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
      expect(data.message).toContain("not allowed");

      // Cleanup isolated test data
      await prisma.projects.delete({ where: { id: isolatedProject.id } });
   });

   it("should return 200 with filtered boards when name query parameter is provided", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}&name=Board 1`, {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as Array<{
         id: string;
         name: string;
         description: string;
      }>;
      expect(Array.isArray(data)).toBe(true);

      // All returned boards should have "Board 1" in the name
      data.forEach((board) => {
         expect(board.name).toContain("Board 1");
      });
   });

   it("should return 200 with filtered boards when description query parameter is provided", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}&description=Description 1`, {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as Array<{
         id: string;
         name: string;
         description: string;
      }>;
      expect(Array.isArray(data)).toBe(true);

      // All returned boards should have "Description 1" in the description
      data.forEach((board) => {
         expect(board.description).toContain("Description 1");
      });
   });

   it("should return 200 with limited results when limit query parameter is provided", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}&limit=1`, {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as Array<unknown>;
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeLessThanOrEqual(1);
   });

   it("should return 422 when projectId is missing", async () => {
      const response = await app.handle(
         new Request("http://localhost/boards", {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when projectId is empty string", async () => {
      const response = await app.handle(
         new Request("http://localhost/boards?projectId=", {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when limit is less than 1", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}&limit=0`, {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 200 with default limit of 10 when limit is not provided", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as Array<unknown>;
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeLessThanOrEqual(10);
   });
});
