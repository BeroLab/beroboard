import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";
import { createAdditionalTestUser, testAuth } from "@/modules/auth/auth.test";

describe("GET /stages/:id", () => {
   let auth: Awaited<typeof testAuth>;
   let otherUser: { sessionCookie: string; userId: string };
   let testProject: { id: string; name: string; description: string; createdAt: string; updatedAt: string };
   let testBoard: Awaited<ReturnType<typeof prisma.boards.create>>;
   let testStage: Awaited<ReturnType<typeof prisma.stages.create>>;

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

      // Create test stage in the board
      const createStageResponse = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Test Stage",
               description: "Test Stage Description",
               boardId: testBoard.id,
            }),
         }),
      );

      if (createStageResponse.status !== 200 && createStageResponse.status !== 201) {
         const errorText = await createStageResponse.text();
         throw new Error(`Failed to create test stage (status ${createStageResponse.status}): ${errorText}`);
      }

      const stageData = (await createStageResponse.json()) as { id: string };
      testStage = await prisma.stages.findUnique({
         where: { id: stageData.id },
      });

      if (!testStage) {
         throw new Error("Failed to find created stage");
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

   it("should return 200 with stage data when stage exists and user has permission", async () => {
      const response = await app.handle(
         new Request(`http://localhost/stages/${testStage.id}`, {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
         id: string;
         name: string;
         description: string;
         boardId: string;
         createdAt: string;
         updatedAt: string;
         tasks: Array<{
            id: string;
            title: string;
            description: string;
            createdAt: string;
            updatedAt: string;
            createdByUserId: string;
            assignedToUserId: string;
         }>;
      };
      expect(data).toHaveProperty("id", testStage.id);
      expect(data).toHaveProperty("name", "Test Stage");
      expect(data).toHaveProperty("description", "Test Stage Description");
      expect(data).toHaveProperty("boardId", testBoard.id);
      expect(data).toHaveProperty("createdAt");
      expect(data).toHaveProperty("updatedAt");
      expect(data).toHaveProperty("tasks");
      expect(Array.isArray(data.tasks)).toBe(true);
   });

   it("should return 401 when user is not authenticated", async () => {
      const response = await app.handle(
         new Request(`http://localhost/stages/${testStage.id}`, {
            method: "GET",
         }),
      );

      expect(response.status).toBe(401);
   });

   it("should return 403 when user does not have permission to get the stage", async () => {
      // Create an isolated project, board, and stage that otherUser doesn't have access to
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

      const isolatedStageResponse = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Isolated Stage",
               description: "Isolated Stage Description",
               boardId: isolatedBoardData.id,
            }),
         }),
      );

      if (isolatedStageResponse.status !== 200 && isolatedStageResponse.status !== 201) {
         throw new Error("Failed to create isolated stage");
      }

      const isolatedStageData = (await isolatedStageResponse.json()) as { id: string };
      const isolatedStage = await prisma.stages.findUnique({
         where: { id: isolatedStageData.id },
      });

      if (!isolatedStage) {
         throw new Error("Failed to find isolated stage");
      }

      // Try to get with otherUser (who doesn't have access to isolatedStage)
      const response = await app.handle(
         new Request(`http://localhost/stages/${isolatedStage.id}`, {
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
      await prisma.stages.delete({ where: { id: isolatedStage.id } });
      await prisma.boards.delete({ where: { id: isolatedBoardData.id } });
      await prisma.projects.delete({ where: { id: isolatedProjectData.id } });
   });

   it("should return 404 when stage does not exist", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages/non-existent-stage-id", {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(404);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
   });
});

