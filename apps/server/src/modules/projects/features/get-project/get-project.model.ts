import z from "zod";

// ** Get Project Model **
export const getProjectModel = z.object({
   id: z.string().min(1, "ID is required"),
});
export const getProjectResponseModel = z.object({
   id: z.string(),
   name: z.string(),
   description: z.string(),
   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date(),
});
export type GetProjectModel = z.infer<typeof getProjectModel> & { userId: string };
export type GetProjectResponseModel = z.infer<typeof getProjectResponseModel> & { createdByUserId: string };
