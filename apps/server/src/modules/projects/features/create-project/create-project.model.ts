import z from "zod";

// ** Create Project Model **
export const createProjectModel = z.object({
   name: z.string().min(1, "Name is required"),
   description: z.string().min(1, "Description is required"),
});
export const createProjectResponseModel = z.object({
   id: z.string(),
   name: z.string(),
   description: z.string(),
   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date(),
});
export type CreateProjectModel = z.infer<typeof createProjectModel> & { userId: string };
export type CreateProjectResponseModel = z.infer<typeof createProjectResponseModel>;
