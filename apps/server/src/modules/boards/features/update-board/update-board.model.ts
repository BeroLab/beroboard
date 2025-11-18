import z from "zod";

//** Update Board Model **
export const updateBoardModel = z.object({
   name: z.string().optional(),
   description: z.string().optional(),
});
export const updateBoardParamsModel = z.object({
   id: z.string().min(1, "ID is required"),
});

export const updateBoardResponseModel = z.object({
   name: z.string(),
   description: z.string(),
   createdAt: z.coerce.date(),
   updatedAt: z.coerce.date(),
});
export type UpdateBoardModel = z.infer<typeof updateBoardModel> & z.infer<typeof updateBoardParamsModel> & { userId: string };
export type UpdateBoardResponseModel = z.infer<typeof updateBoardResponseModel>;
