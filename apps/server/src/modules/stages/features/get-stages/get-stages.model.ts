import z from "zod";

export const getStagesModel = z.object({
   cursor: z.string().optional(),
   limit: z.coerce.number().min(1, "Limit is required").optional().default(10),
   name: z.string().optional(),
   description: z.string().optional(),
   boardId: z.string(),
   createdAt: z.coerce.date().optional(),
   updatedAt: z.coerce.date().optional(),
});

export const getStagesResponseModel = z.array(
   z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      boardId: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      deletedAt: z.coerce.date().nullable(),
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
   }),
);
export type GetStagesModel = z.infer<typeof getStagesModel> & { userId: string };
export type GetStagesResponseModel = z.infer<typeof getStagesResponseModel>;
