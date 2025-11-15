import z from "zod";

//** Delete Board Model **
export const deleteBoardParamsModel = z.object({
   id: z.string().min(1, "ID is required"),
});
export const deleteBoardQueryParamsModel = z.object({
   projectId: z.string().min(1, "Project ID is required"),
});
export type DeleteBoardModel = z.infer<typeof deleteBoardParamsModel> & z.infer<typeof deleteBoardQueryParamsModel> & { userId: string };
