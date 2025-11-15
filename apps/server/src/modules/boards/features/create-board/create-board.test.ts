import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";
import { createAdditionalTestUser, testAuth } from "@/modules/auth/auth.test";

describe("POST /boards", () => {
   let auth: Awaited<typeof testAuth>;
   let otherUser: { sessionCookie: string; userId: string };
   let otherUserEmail: string;
   let testProject: { id: string; name: string; description: string; createdAt: string; updatedAt: string };

   beforeEach(async () => {
      // Get the global test user (automatically initialized when first accessed)
      auth = await testAuth;

      // Create an additional user for testing authorization
      otherUserEmail = `other-${Date.now()}@example.com`;
      otherUser = await createAdditionalTestUser(otherUserEmail, "password123", "Other User");

      // Create test project owned by testUser via API
      const createProjectResponse = await app.handle(
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

      // Add otherUser to the project via API
      // Note: Since project creation now automatically adds the creator to usersSubscribed,
      // the creator should be able to add other users
      const addUserResponse = await app.handle(
         new Request(`http://localhost/projects/${testProject.id}/users`, {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               userId: otherUser.userId,
            }),
         }),
      );

      if (addUserResponse.status !== 200 && addUserResponse.status !== 201) {
         const errorText = await addUserResponse.text();
         throw new Error(`Failed to add user to project (status ${addUserResponse.status}): ${errorText}`);
      }
   });

   afterEach(async () => {
      // Cleanup: Remove test data (but not users/sessions as they're managed globally)
      await prisma.boards.deleteMany({});
      await prisma.projects.deleteMany({});
   });

   it("should return 201 with board data when board is created successfully", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Board",
               description: "New Board Description",
            }),
         }),
      );

      expect(response.status).toBe(201);
      const data = (await response.json()) as {
         id: string;
         name: string;
         description: string;
         createdAt: string;
         updatedAt: string;
      };
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("name", "New Board");
      expect(data).toHaveProperty("description", "New Board Description");
      expect(data).toHaveProperty("createdAt");
      expect(data).toHaveProperty("updatedAt");

      // Verify board was actually created via API
      const getBoardResponse = await app.handle(
         new Request(`http://localhost/boards/${data.id}`, {
            method: "GET",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      expect(getBoardResponse.status).toBe(200);
      const board = (await getBoardResponse.json()) as {
         id: string;
         name: string;
         description: string;
         createdAt: string;
         updatedAt: string;
      };
      expect(board).toHaveProperty("id", data.id);
      expect(board).toHaveProperty("name", "New Board");
      expect(board).toHaveProperty("description", "New Board Description");
      // Note: projectId is not included in the GET board response model
   });

   it("should return 401 when user is not authenticated", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Board",
               description: "New Board Description",
            }),
         }),
      );

      expect(response.status).toBe(401);
      const text = await response.text();
      expect(text).toBe("User not authorized");
   });

   it("should return 422 when name is missing", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               description: "New Board Description",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when description is missing", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Board",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when name is empty", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "",
               description: "New Board Description",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when description is empty", async () => {
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Board",
               description: "",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 422 when projectId is missing", async () => {
      const response = await app.handle(
         new Request("http://localhost/boards", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Board",
               description: "New Board Description",
            }),
         }),
      );

      // Elysia returns 422 for validation errors
      expect(response.status).toBe(422);
   });

   it("should return 404 when project does not exist", async () => {
      const response = await app.handle(
         new Request("http://localhost/boards?projectId=non-existent-project-id", {
            method: "POST",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Board",
               description: "New Board Description",
            }),
         }),
      );

      expect(response.status).toBe(404);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
      expect(data.message).toBe("Project not found");
   });

   it("should return 403 when user is not the project creator", async () => {
      // otherUser is subscribed to the project but not the creator
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${testProject.id}`, {
            method: "POST",
            headers: {
               cookie: otherUser.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Board",
               description: "New Board Description",
            }),
         }),
      );

      expect(response.status).toBe(403);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
      expect(data.message).toBe("You are not allowed to create a board for this project");
   });

   it("should return 403 when user does not belong to the project", async () => {
      // Create a project that otherUser doesn't belong to via API
      const createIsolatedProjectResponse = await app.handle(
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

      if (createIsolatedProjectResponse.status !== 200 && createIsolatedProjectResponse.status !== 201) {
         const errorText = await createIsolatedProjectResponse.text();
         throw new Error(`Failed to create isolated project (status ${createIsolatedProjectResponse.status}): ${errorText}`);
      }

      const isolatedProject = (await createIsolatedProjectResponse.json()) as {
         id: string;
         name: string;
         description: string;
      };

      // Try to create board with otherUser (who doesn't belong to isolatedProject)
      // The use case first checks if project exists (it does), then checks if user belongs (they don't) → 403
      const response = await app.handle(
         new Request(`http://localhost/boards?projectId=${isolatedProject.id}`, {
            method: "POST",
            headers: {
               cookie: otherUser.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               name: "New Board",
               description: "New Board Description",
            }),
         }),
      );

      expect(response.status).toBe(403);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
      expect(data.message).toBe("You are not allowed to create a board for this project");

      // Cleanup isolated test data via API
      const deleteResponse = await app.handle(
         new Request(`http://localhost/projects/${isolatedProject.id}`, {
            method: "DELETE",
            headers: {
               cookie: auth.sessionCookie,
            },
         }),
      );

      if (deleteResponse.status !== 200 && deleteResponse.status !== 204) {
         // If delete fails, fall back to Prisma for cleanup
         await prisma.projects.delete({ where: { id: isolatedProject.id } }).catch(() => {
            // Ignore cleanup errors
         });
      }
   });
});
