export type ResourceType = "project" | "board" | "stage" | "task";
export type Operation = "read" | "write" | "delete" | "create";
export interface UserCanAccessResourceModel {
   resourceType: ResourceType;
   organizationId: string;
   userId: string;
   operation: Operation;
}
