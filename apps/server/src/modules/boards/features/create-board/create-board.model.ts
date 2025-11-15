import z from "zod";

//** Create Board Model **
export const createBoardModel = z.object({
   name: z.string().min(1, "Name is required"),
   description: z.string().min(1, "Description is required"),
});
export const createBoardQueryParamsModel = z.object({
   projectId: z.string().min(1, "Project ID is required"),
});
export const createBoardResponseModel = z.object({
   id: z.string(),
   name: z.string(),
   description: z.string(),
   createdAt: z.date(),
   updatedAt: z.date(),
});
export type CreateBoardModel = z.infer<typeof createBoardModel> & z.infer<typeof createBoardQueryParamsModel> & { userId: string };
export type CreateBoardResponseModel = z.infer<typeof createBoardResponseModel>;
