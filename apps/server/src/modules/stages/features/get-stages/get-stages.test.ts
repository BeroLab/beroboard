import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";
import { createAdditionalTestUser, testAuth } from "@/modules/auth/auth.test";

describe("GET /stages", () => {
   let auth: Awaited<typeof testAuth>;
   let otherUser: { sessionCookie: string; userId: string };
   let testProject: { id: string; name: string; description: string; createdAt: string; updatedAt: string };
   let testBoard: Awaited<ReturnType<typeof prisma.boards.create>>;
   let testStage1: Awaited<ReturnType<typeof prisma.stages.create>>;
   let testStage2: Awaited<ReturnType<typeof prisma.stages.create>>;

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
      const foundBoard = await prisma.boards.findUnique({
         where: { id: boardData.id },
      });

      if (!foundBoard) {
         throw new Error("Failed to find created board");
      }
      testBoard = foundBoard;

      // Create test stages in the board
      const createStage1Response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Test Stage 1",
               description: "Test Stage Description 1",
               boardId: testBoard.id,
            }),
         }),
      );

      if (createStage1Response.status !== 200 && createStage1Response.status !== 201) {
         const errorText = await createStage1Response.text();
         throw new Error(`Failed to create test stage 1 (status ${createStage1Response.status}): ${errorText}`);
      }

      const stage1Data = (await createStage1Response.json()) as { id: string };
      const foundStage1 = await prisma.stages.findUnique({
         where: { id: stage1Data.id },
      });

      if (!foundStage1) {
         throw new Error("Failed to find created stage 1");
      }
      testStage1 = foundStage1;

      const createStage2Response = await app.handle(
         new Request("http://localhost/stages", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Test Stage 2",
               description: "Test Stage Description 2",
               boardId: testBoard.id,
            }),
         }),
      );

      if (createStage2Response.status !== 200 && createStage2Response.status !== 201) {
         const errorText = await createStage2Response.text();
         throw new Error(`Failed to create test stage 2 (status ${createStage2Response.status}): ${errorText}`);
      }

      const stage2Data = (await createStage2Response.json()) as { id: string };
      const foundStage2 = await prisma.stages.findUnique({
         where: { id: stage2Data.id },
      });

      if (!foundStage2) {
         throw new Error("Failed to find created stage 2");
      }
      testStage2 = foundStage2;
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

   it("should return 200 with stages array when board has stages and user has permission", async () => {
      const response = await app.handle(
         new Request(`http://localhost/stages?boardId=${testBoard.id}`, {
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
         boardId: string;
         createdAt: string;
         updatedAt: string;
         deletedAt: string | null;
         tasks: Array<{
            id: string;
            title: string;
            description: string;
            createdAt: string;
            updatedAt: string;
            createdByUserId: string;
            assignedToUserId: string;
         }>;
      }>;
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(2);

      // Verify stages are in the response
      const stageIds = data.map((s) => s.id);
      expect(stageIds).toContain(testStage1.id);
      expect(stageIds).toContain(testStage2.id);

      // Verify stage structure
      const stage1 = data.find((s) => s.id === testStage1.id);
      expect(stage1).toBeDefined();
      expect(stage1?.name).toBe("Test Stage 1");
      expect(stage1?.description).toBe("Test Stage Description 1");
      expect(stage1?.boardId).toBe(testBoard.id);
      expect(stage1).toHaveProperty("createdAt");
      expect(stage1).toHaveProperty("updatedAt");
      expect(stage1).toHaveProperty("tasks");
      expect(Array.isArray(stage1?.tasks)).toBe(true);
   });

   it("should return 200 with empty array when board has no stages", async () => {
      // Create a new board with no stages
      const newBoardResponse = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "Empty Board",
               description: "Empty Board Description",
            }),
         }),
      );

      if (newBoardResponse.status !== 200 && newBoardResponse.status !== 201) {
         throw new Error("Failed to create new board");
      }

      const newBoardData = (await newBoardResponse.json()) as { id: string };

      const response = await app.handle(
         new Request(`http://localhost/stages?boardId=${newBoardData.id}`, {
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
         new Request(`http://localhost/stages?boardId=${testBoard.id}`, {
            method: "GET",
         }),
      );

      expect(response.status).toBe(401);
   });

   it("should return 403 when user does not have permission to get stages for the board", async () => {
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
      const isolatedBoard = await prisma.boards.findUnique({
         where: { id: isolatedBoardData.id },
      });

      if (!isolatedBoard) {
         throw new Error("Failed to find isolated board");
      }

      // Try to get stages with otherUser (who doesn't have access to isolatedBoard)
      const response = await app.handle(
         new Request(`http://localhost/stages?boardId=${isolatedBoard.id}`, {
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
      await prisma.boards.delete({ where: { id: isolatedBoard.id } });
      await prisma.projects.delete({ where: { id: isolatedProjectData.id } });
   });

   it("should return 200 with filtered stages when name query parameter is provided", async () => {
      const response = await app.handle(
         new Request(`http://localhost/stages?boardId=${testBoard.id}&name=Stage 1`, {
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

      // All returned stages should have "Stage 1" in the name
      data.forEach((stage) => {
         expect(stage.name).toContain("Stage 1");
      });
   });

   it("should return 200 with filtered stages when description query parameter is provided", async () => {
      const response = await app.handle(
         new Request(`http://localhost/stages?boardId=${testBoard.id}&description=Description 1`, {
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

      // All returned stages should have "Description 1" in the description
      data.forEach((stage) => {
         expect(stage.description).toContain("Description 1");
      });
   });

   it("should return 200 with limited results when limit query parameter is provided", async () => {
      const response = await app.handle(
         new Request(`http://localhost/stages?boardId=${testBoard.id}&limit=1`, {
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

   it("should return 422 when boardId is missing", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages", {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 or 404 when boardId is empty string", async () => {
      const response = await app.handle(
         new Request("http://localhost/stages?boardId=", {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      // Elysia returns 422 for validation errors or 404 for route mismatch
      expect([404, 422]).toContain(response.status);
   });

   it("should return 422 when limit is less than 1", async () => {
      const response = await app.handle(
         new Request(`http://localhost/stages?boardId=${testBoard.id}&limit=0`, {
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
         new Request(`http://localhost/stages?boardId=${testBoard.id}`, {
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
