import z from "zod";

//** Get Boards Model **
export const getBoardsModel = z.object({
   cursor: z.string().optional(),
   limit: z.number().min(1, "Limit is required").optional().default(10),
   name: z.string().optional(),
   description: z.string().optional(),
   createdAt: z.date().optional(),
   updatedAt: z.date().optional(),
   projectId: z.string().min(1, "Project ID is required"),
});
export const getBoardsResponseModel = z.array(
   z.object({
      projectId: z.string(),
      id: z.string().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      createdAt: z.date().optional(),
      updatedAt: z.date().optional(),
   }),
);
export type GetBoardsModel = z.infer<typeof getBoardsModel> & { userId: string };
export type GetBoardsResponseModel = z.infer<typeof getBoardsResponseModel>;
