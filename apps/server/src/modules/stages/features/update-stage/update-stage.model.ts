import z from "zod";

export const updateStageModel = z.object({
   id: z.string().min(1, "ID is required"),
   name: z.string().optional(),
   description: z.string().optional(),
});
export const updateStageResponseModel = z.object({
   id: z.string(),
   name: z.string(),
   description: z.string(),
   boardId: z.string(),
   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date(),
});
export type UpdateStageModel = z.infer<typeof updateStageModel> & { userId: string };
export type UpdateStageResponseModel = z.infer<typeof updateStageResponseModel>;

