import z from "zod";

// ** Get Projects Model **
export const getProjectsModel = z.object({
   cursor: z.string().optional(),
   limit: z.coerce.number().min(1, "Limit is required").optional().default(10),
   title: z.string().optional(),
   description: z.string().optional(),
   createdAt: z.coerce.date().optional(),
   updatedAt: z.coerce.date().optional(),
});

export const getProjectsResponseModel = z.array(
   z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      deletedAt: z.coerce.date().nullable(),
      createdByUserId: z.string(),
   }),
);
export type GetProjectsModel = z.infer<typeof getProjectsModel> & { userId: string };
export type GetProjectsResponseModel = z.infer<typeof getProjectsResponseModel>;
