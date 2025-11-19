import z from "zod";

export const createStageModel = z.object({
   name: z.string().min(1, "Name is required"),
   description: z.string().min(1, "Description is required"),
   boardId: z.string().min(1, "Board ID is required"),
});
export const createStageResponseModel = z.object({
   id: z.string(),
   name: z.string(),
   description: z.string(),
   boardId: z.string(),
   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date(),
});
export type CreateStageModel = z.infer<typeof createStageModel> & { userId: string };
export type CreateStageResponseModel = z.infer<typeof createStageResponseModel>;
