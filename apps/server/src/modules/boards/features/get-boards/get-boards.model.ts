import z from "zod";

//** Get Boards Model **
export const getBoardsModel = z.object({
   cursor: z.string().optional(),
   limit: z.coerce.number().min(1, "Limit is required").optional().default(10),
   name: z.string().optional(),
   description: z.string().optional(),
   createdAt: z.coerce.date().optional(),
   updatedAt: z.coerce.date().optional(),
   projectId: z.string().min(1, "Project ID is required"),
});
export const getBoardsResponseModel = z.array(
   z
      .object({
         id: z.string(),
         name: z.string(),
         projectId: z.string(),
         description: z.string(),
         createdAt: z.coerce.date(),
         updatedAt: z.coerce.date(),
         deletedAt: z.coerce.date().nullable(),
      })
      .optional(),
);
export type GetBoardsModel = z.infer<typeof getBoardsModel> & { userId: string };
export type GetBoardsResponseModel = z.infer<typeof getBoardsResponseModel>;
