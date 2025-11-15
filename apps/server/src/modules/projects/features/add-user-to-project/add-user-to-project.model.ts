import z from "zod";

// ** Add User to Project Model **
export const addUserToProjectModel = z.object({
   userId: z.string().min(1, "User ID is required"),
});
export const addUserToProjectParamsModel = z.object({
   id: z.string().min(1, "ID is required"),
});
export type AddUserToProjectModel = z.infer<typeof addUserToProjectModel> & z.infer<typeof addUserToProjectParamsModel> & { ownerId: string };
