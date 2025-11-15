import prisma from "@beroboard/db";
import type { AddUserToProjectModel } from "./add-user-to-project.model";

export async function addUserToProjectRepository(params: AddUserToProjectModel): Promise<void> {
   await prisma.projects.update({
      where: { id: params.id },
      data: { usersSubscribed: { connect: { id: params.userId } } },
   });
}
