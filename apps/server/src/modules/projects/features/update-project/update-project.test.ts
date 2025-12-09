import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import prisma from "@beroboard/db";
import { app } from "@/index";
import { createAdditionalTestUser, testAuth } from "@/modules/auth/auth.test";

describe("PATCH /projects/:id", () => {
   let auth: Awaited<typeof testAuth>;
   let otherUser: { sessionCookie: string; userId: string };
   let testProject: Awaited<ReturnType<typeof prisma.projects.create>>;

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

   it("should return 200 with updated project data when updating both name and description", async () => {
      const response = await app.handle(
         new Request(`http://localhost/projects/${testProject.id}`, {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: testProject.id,
               name: "Updated Project Name",
               description: "Updated Description",
            }),
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
         id: string;
         name: string;
         description: string;
         createdAt: string;
         updatedAt: string;
      };
      expect(data).toHaveProperty("id", testProject.id);
      expect(data).toHaveProperty("name", "Updated Project Name");
      expect(data).toHaveProperty("description", "Updated Description");
      expect(data).toHaveProperty("createdAt");
      expect(data).toHaveProperty("updatedAt");

      // Verify project was actually updated in database
      const updatedProject = await prisma.projects.findUnique({
         where: { id: testProject.id },
      });
      expect(updatedProject).not.toBeNull();
      expect(updatedProject?.name).toBe("Updated Project Name");
      expect(updatedProject?.description).toBe("Updated Description");
   });

   it("should return 200 with updated project data when updating only name", async () => {
      const response = await app.handle(
         new Request(`http://localhost/projects/${testProject.id}`, {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: testProject.id,
               name: "Updated Name Only",
            }),
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
         id: string;
         name: string;
         description: string;
      };
      expect(data).toHaveProperty("id", testProject.id);
      expect(data).toHaveProperty("name", "Updated Name Only");
      expect(data).toHaveProperty("description", "Test Description"); // Original description should remain

      // Verify project was actually updated in database
      const updatedProject = await prisma.projects.findUnique({
         where: { id: testProject.id },
      });
      expect(updatedProject).not.toBeNull();
      expect(updatedProject?.name).toBe("Updated Name Only");
      expect(updatedProject?.description).toBe("Test Description");
   });

   it("should return 200 with updated project data when updating only description", async () => {
      const response = await app.handle(
         new Request(`http://localhost/projects/${testProject.id}`, {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: testProject.id,
               description: "Updated Description Only",
            }),
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
         id: string;
         name: string;
         description: string;
      };
      expect(data).toHaveProperty("id", testProject.id);
      expect(data).toHaveProperty("name", "Test Project"); // Original name should remain
      expect(data).toHaveProperty("description", "Updated Description Only");

      // Verify project was actually updated in database
      const updatedProject = await prisma.projects.findUnique({
         where: { id: testProject.id },
      });
      expect(updatedProject).not.toBeNull();
      expect(updatedProject?.name).toBe("Test Project");
      expect(updatedProject?.description).toBe("Updated Description Only");
   });

   it("should return 200 with unchanged project data when no fields are provided", async () => {
      const response = await app.handle(
         new Request(`http://localhost/projects/${testProject.id}`, {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: testProject.id,
            }),
         }),
      );

      expect(response.status).toBe(200);
      const data = (await response.json()) as {
         id: string;
         name: string;
         description: string;
      };
      expect(data).toHaveProperty("id", testProject.id);
      expect(data).toHaveProperty("name", "Test Project");
      expect(data).toHaveProperty("description", "Test Description");
   });

   it("should return 401 when user is not authenticated", async () => {
      const response = await app.handle(
         new Request(`http://localhost/projects/${testProject.id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: testProject.id,
               name: "Updated Name",
            }),
         }),
      );

      expect(response.status).toBe(401);
   });

   it("should return 403 when user does not have permission to update the project", async () => {
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

      // Try to update with otherUser (who doesn't have access to isolatedProject)
      const response = await app.handle(
         new Request(`http://localhost/projects/${isolatedProject.id}`, {
            method: "PATCH",
            headers: {
               cookie: otherUser.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: isolatedProject.id,
               name: "Unauthorized Update",
            }),
         }),
      );

      expect(response.status).toBe(403);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
      expect(data.message).toContain("not allowed");

      // Cleanup isolated test data
      await prisma.projects.delete({ where: { id: isolatedProject.id } });
   });

   it("should return 404 when project does not exist", async () => {
      const response = await app.handle(
         new Request("http://localhost/projects/non-existent-project-id", {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: "non-existent-project-id",
               name: "Updated Name",
            }),
         }),
      );

      expect(response.status).toBe(404);
      const data = (await response.json()) as { message: string };
      expect(data).toHaveProperty("message");
   });

   it("should return 404 or 422 when id is missing or empty", async () => {
      // The route pattern /:id doesn't match /projects/, so it returns 404
      // But validation might return 422 for empty id
      const response = await app.handle(
         new Request("http://localhost/projects/", {
            method: "PATCH",
            headers: {
               cookie: auth.sessionCookie,
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               id: "",
               name: "Updated Name",
            }),
         }),
      );

      // Elysia returns 404 when route doesn't match or 422 for validation
      expect([404, 422]).toContain(response.status);
   });
});
