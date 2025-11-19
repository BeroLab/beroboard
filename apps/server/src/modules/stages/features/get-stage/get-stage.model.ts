import z from "zod";

export const getStageModel = z.object({
   id: z.string().min(1, "ID is required"),
});
export const getStageResponseModel = z.object({
   id: z.string(),
   name: z.string(),
   description: z.string(),
   boardId: z.string(),
   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date(),
   tasks: z.array(
      z.object({
         id: z.string(),
         title: z.string(),
         description: z.string(),
         createdAt: z.coerce.date(),
         updatedAt: z.coerce.date(),
         createdByUserId: z.string(),
         assignedToUserId: z.string(),
      }),
   ),
});
export type GetStageModel = z.infer<typeof getStageModel> & { userId: string };
export type GetStageResponseModel = z.infer<typeof getStageResponseModel>;

