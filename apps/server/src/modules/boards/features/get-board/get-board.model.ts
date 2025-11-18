import z from "zod";

//** Get Board Model **
export const getBoardModel = z.object({
   id: z.string().min(1, "ID is required"),
});
export const getBoardResponseModel = z.object({
   id: z.string(),
   name: z.string(),
   description: z.string(),
   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date(),
});
export type GetBoardModel = z.infer<typeof getBoardModel> & { userId: string };
export type GetBoardResponseModel = z.infer<typeof getBoardResponseModel>;
