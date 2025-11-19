import prisma from "@beroboard/db";
import type { CreateProjectModel, CreateProjectResponseModel } from "./create-project.model";
import { createProjectRepository } from "./create-project.repository";

export async function createProjectUseCase(project: CreateProjectModel): Promise<CreateProjectResponseModel> {
   const slug = project.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

   const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
         data: {
            name: project.name,
            slug: slug,
         },
      });

      await tx.member.create({
         data: {
            userId: project.userId,
            organizationId: organization.id,
            role: "owner",
         },
      });

      return organization;
   });

   return await createProjectRepository({
      ...project,
      organizationId: result.id,
   });
}
