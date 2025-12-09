import prisma from "@beroboard/db";
import type { UserCanAccessResourceModel } from "./user-can-access-resource.model";

/**
 * Checks if a user can perform an operation on a resource based on their organization role.
 * Uses the database (which Better Auth uses) to check membership and role.
 * Permission rules:
 * - Owner: Full access to all resources
 * - Admin: Can create/update/delete/get Boards, Stages, Tasks
 * - User: Can only create/update/delete/get Tasks
 */
export async function userCanAccessResourceRepository({ resourceType, organizationId, userId, operation }: UserCanAccessResourceModel): Promise<boolean> {
   // Get user's membership and role in the organization
   const member = await prisma.member.findUnique({
      where: {
         userId_organizationId: {
            userId,
            organizationId,
         },
      },
      select: {
         role: true,
      },
   });

   if (!member) return false;

   const role = member.role;

   // Owner has full access to all resources
   if (role === "owner") {
      return true;
   }

   // Admin can perform all operations on boards, stages, and tasks
   if (role === "admin") {
      return resourceType === "board" || resourceType === "stage" || resourceType === "task";
   }

   // User can only perform operations on tasks
   if (role === "user") {
      return resourceType === "task";
   }

   return false;
}
