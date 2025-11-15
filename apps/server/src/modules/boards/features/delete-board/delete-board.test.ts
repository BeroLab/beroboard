import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";
import { createAdditionalTestUser, testAuth } from "@/modules/auth/auth.test";

describe("DELETE /boards/:id", () => {
   let auth: Awaited<typeof testAuth>;
   let otherUser: { sessionCookie: string; userId: string };
   let otherUserEmail: string;
   let testProject: Awaited<ReturnType<typeof prisma.projects.create>>;
   let testBoard: Awaited<ReturnType<typeof prisma.boards.create>>;

   beforeEach(async () => {
      // Get the global test user (automatically initialized when first accessed)
      auth = await testAuth;

      // Create an additional user for testing authorization
      otherUserEmail = `other-${Date.now()}@example.com`;
      otherUser = await createAdditionalTestUser(otherUserEmail, "password123", "Other User");

      // Get the test user ID from auth
      const testUser = await prisma.user.findUnique({
         where: { email: auth.email },
      });

      if (!testUser) {
         throw new Error("Failed to find test user");
      }

      // Create test project owned by testUser
      testProject = await prisma.projects.create({
         data: {
            id: `test-project-${Date.now()}`,
            name: "Test Project",
            description: "Test Description",
            createdByUserId: testUser.id,
            usersSubscribed: {
               connect: [{ id: testUser.id }],
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
      await prisma.boards.deleteMany({});
      await prisma.projects.deleteMany({});
   });

   it("should return 200 when board is successfully deleted", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards/${testBoard.id}?projectId=${testProject.id}`, {
            method: "DELETE",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(200);

      // Verify board was deleted from database
      const board = await prisma.boards.findUnique({
         where: { id: testBoard.id },
      });
      expect(board).toBeNull();
   });

   it("should return 401 when user is not authenticated", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards/${testBoard.id}?projectId=${testProject.id}`, {
            method: "DELETE",
         }),
      );

      expect(response.status).toBe(401);
      const text = await response.text();
      expect(text).toBe("User not authorized");
   });

   it("should return 404 when user does not belong to the project", async () => {
      // Create a project that otherUser doesn't belong to
      const testUser = await prisma.user.findUnique({
         where: { email: auth.email },
      });
      if (!testUser) {
         throw new Error("Failed to find test user");
      }

      const isolatedProject = await prisma.projects.create({
         data: {
            id: `isolated-project-${Date.now()}`,
            name: "Isolated Project",
            description: "Isolated Description",
            createdByUserId: testUser.id,
            usersSubscribed: {
               connect: [{ id: testUser.id }],
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

      // Try to delete with otherUser (who doesn't belong to isolatedProject)
      // The repository filters by user membership, so it returns null → 404
      const response = await app.handle(
         new Request(`http://localhost/boards/${isolatedBoard.id}?projectId=${isolatedProject.id}`, {
            method: "DELETE",
            headers: {
               cookie: otherUser.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(404);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
      expect(data.message).toBe("Board not found");

      // Cleanup isolated test data
      await prisma.boards.delete({ where: { id: isolatedBoard.id } });
      await prisma.projects.delete({ where: { id: isolatedProject.id } });
   });

   it("should return 404 when board does not exist", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards/non-existent-board-id?projectId=${testProject.id}`, {
            method: "DELETE",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(404);
   });

   it("should return 404 when route does not match (empty id)", async () => {
      // The route pattern /:id doesn't match /boards/, so it returns 404
      const response = await app.handle(
         new Request(`http://localhost/boards/?projectId=${testProject.id}`, {
            method: "DELETE",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(404);
   });

   it("should return 422 when projectId is missing", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards/${testBoard.id}`, {
            method: "DELETE",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(422);
   });

   it("should return 422 when projectId is empty string", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards/${testBoard.id}?projectId=`, {
            method: "DELETE",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(response.status).toBe(422);
   });
});
