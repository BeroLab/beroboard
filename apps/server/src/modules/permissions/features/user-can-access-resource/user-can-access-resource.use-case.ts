import { getOrganizationIdFromResourceRepository } from "../get-organization-from-resource/get-organization-from-resource.repository";
import type { UserCanAccessResourceModel } from "./user-can-access-resource.model";
import { userCanAccessResourceRepository } from "./user-can-access-resource.repository";

export async function userCanAccessResourceUseCase({
   resourceId,
   resourceType,
   userId,
   operation,
}: {
   resourceType: UserCanAccessResourceModel["resourceType"];
   resourceId: string;
   userId: string;
   operation: UserCanAccessResourceModel["operation"];
}): Promise<boolean> {
   // Get organization ID from the resource
   const organizationId = await getOrganizationIdFromResourceRepository(resourceType, resourceId);
   if (!organizationId) return false;

   // Check permissions using organization ID
   return await userCanAccessResourceRepository({
      resourceType,
      organizationId,
      userId,
      operation,
   });
}
