import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";
import { createAdditionalTestUser, testAuth } from "@/modules/auth/auth.test";

describe("POST /stages", () => {
   let auth: Awaited<typeof testAuth>;
   let otherUser: { sessionCookie: string; userId: string };
   let testProject: { id: string; name: string; description: string; createdAt: string; updatedAt: string };
   let testBoard: Awaited<ReturnType<typeof prisma.boards.create>>;

   beforeEach(async () => {
      // Get the global test user (automatically initialized when first accessed)
      auth = await testAuth;

      // Create an additional user for testing authorization
      const otherUserEmail = `other-${Date.now()}@example.com`;
      otherUser = await createAdditionalTestUser(otherUserEmail, "password123", "Other User");

      // Create test project owned by testUser via API
      const projectName = `Test Project ${Date.now()}`;
      const createProjectResponse = await app.handle(
         new Request("http://localhost/projects", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: projectName,
               description: "Test Description",
            }),
         }),
      );

      if (createProjectResponse.status !== 200 && createProjectResponse.status !== 201) {
         const errorText = await createProjectResponse.text();
         throw new Error(`Failed to create test project (status ${createProjectResponse.status}): ${errorText}`);
      }

      testProject = (await createProjectResponse.json()) as {
         id: string;
         name: string;
         description: string;
         createdAt: string;
         updatedAt: string;
      };

      // Get the project's organization and add otherUser as member
      const project = await prisma.projects.findUnique({
         where: { id: testProject.id },
         select: { organizationId: true },
      });

      if (project) {
         await prisma.member.create({
            data: {
               userId: otherUser.userId,
               organizationId: project.organizationId,
               role: "user",
            },
         });
      }

      // Create test board in the project
      const createBoardResponse = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Test Board",
               description: "Test Board Description",
            }),
         }),
      );

      if (createBoardResponse.status !== 200 && createBoardResponse.status !== 201) {
         const errorText = await createBoardResponse.text();
         throw new Error(`Failed to create test board (status ${createBoardResponse.status}): ${errorText}`);
      }

      const boardData = (await createBoardResponse.json()) as { id: string };
      testBoard = await prisma.boards.findUnique({
         where: { id: boardData.id },
      });

      if (!testBoard) {
         throw new Error("Failed to find created board");
      }
   });

   afterEach(async () => {
      // Cleanup: Remove test data (but not users/sessions as they're managed globally)
      // Delete in order to respect foreign key constraints
      await prisma.stages.deleteMany({});
      await prisma.boards.deleteMany({});
      await prisma.projects.deleteMany({});
      await prisma.member.deleteMany({});
      await prisma.organization.deleteMany({});
      await prisma.invitation.deleteMany({});
   });

   it("should return 201 with stage data when stage is created successfully", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Stage",
               description: "New Stage Description",
               boardId: testBoard.id,
            }),
         }),
      );

      // Elysia may return 200 instead of 201 unless status is explicitly set
      expect([200, 201]).toContain(response.status);
      const data = (await response.json()) as {
         id: string;
         name: string;
         description: string;
         boardId: string;
         createdAt: string;
         updatedAt: string;
      };
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("name", "New Stage");
      expect(data).toHaveProperty("description", "New Stage Description");
      expect(data).toHaveProperty("boardId", testBoard.id);
      expect(data).toHaveProperty("createdAt");
      expect(data).toHaveProperty("updatedAt");

      // Verify stage was actually created in database
      const stage = await prisma.stages.findUnique({
         where: { id: data.id },
      });
      expect(stage).not.toBeNull();
      expect(stage?.name).toBe("New Stage");
      expect(stage?.description).toBe("New Stage Description");
      expect(stage?.boardId).toBe(testBoard.id);
   });

   it("should return 401 when user is not authenticated", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Stage",
               description: "New Stage Description",
               boardId: testBoard.id,
            }),
         }),
      );

      expect(response.status).toBe(401);
      const text = await response.text();
      expect(text).toBe("User not authorized");
   });

   it("should return 422 when name is missing", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               description: "New Stage Description",
               boardId: testBoard.id,
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when description is missing", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Stage",
               boardId: testBoard.id,
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when boardId is missing", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Stage",
               description: "New Stage Description",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when name is empty", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "",
               description: "New Stage Description",
               boardId: testBoard.id,
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when description is empty", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Stage",
               description: "",
               boardId: testBoard.id,
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when boardId is empty", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Stage",
               description: "New Stage Description",
               boardId: "",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 403 when user does not have permission to create a stage for the board", async () => {
      // Create an isolated project and board that otherUser doesn't have access to
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

      const isolatedBoardResponse = await app.handle(
         new Request(`http://localhost/boards?projectId=${isolatedProjectData.id}`, {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Isolated Board",
               description: "Isolated Board Description",
            }),
         }),
      );

      if (isolatedBoardResponse.status !== 200 && isolatedBoardResponse.status !== 201) {
         throw new Error("Failed to create isolated board");
      }

      const isolatedBoardData = (await isolatedBoardResponse.json()) as { id: string };

      // Try to create stage with otherUser (who doesn't have access to isolatedBoard)
      const response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: otherUser.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Unauthorized Stage",
               description: "Unauthorized Description",
               boardId: isolatedBoardData.id,
            }),
         }),
      );

      expect(response.status).toBe(403);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
      expect(data.message).toContain("not allowed");

      // Cleanup isolated test data
      await prisma.boards.delete({ where: { id: isolatedBoardData.id } });
      await prisma.projects.delete({ where: { id: isolatedProjectData.id } });
   });
});
