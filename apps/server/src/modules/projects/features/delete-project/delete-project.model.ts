import z from "zod";

// ** Delete Project Model **
export const deleteProjectModel = z.object({
   id: z.string().min(1, "ID is required"),
});
export type DeleteProjectModel = z.infer<typeof deleteProjectModel> & { userId: string };
