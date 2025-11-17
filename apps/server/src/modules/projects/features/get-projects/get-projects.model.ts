import z from "zod";

// ** Get Projects Model **
export const getProjectsModel = z.object({
   cursor: z.string().optional(),
   limit: z.number().min(1, "Limit is required").optional().default(10),
   title: z.string().optional(),
   description: z.string().optional(),
   createdAt: z.date().optional(),
   updatedAt: z.date().optional(),
});

export const getProjectsResponseModel = z.array(
   z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      deletedAt:z.date().nullable(),
      createdByUserId:z.string()
   }),
);
export type GetProjectsModel = z.infer<typeof getProjectsModel> & { userId: string } & { usersSubscribed?: { id: string }[] };
export type GetProjectsResponseModel = z.infer<typeof getProjectsResponseModel>;
