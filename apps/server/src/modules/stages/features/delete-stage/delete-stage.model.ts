import z from "zod";

export const deleteStageModel = z.object({
   id: z.string().min(1, "ID is required"),
});
export type DeleteStageModel = z.infer<typeof deleteStageModel> & { userId: string };
