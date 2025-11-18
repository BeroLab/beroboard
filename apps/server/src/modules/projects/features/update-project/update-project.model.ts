import z from "zod";

// ** Update Project Model **
export const updateProjectModel = z.object({
   id: z.string().min(1, "ID is required"),
   name: z.string().optional(),
   description: z.string().optional(),
});
export const updateProjectResponseModel = z.object({
   id: z.string(),
   name: z.string(),
   description: z.string(),
   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date(),
});
export type UpdateProjectModel = z.infer<typeof updateProjectModel> & { userId: string };
export type UpdateProjectResponseModel = z.infer<typeof updateProjectResponseModel>;
