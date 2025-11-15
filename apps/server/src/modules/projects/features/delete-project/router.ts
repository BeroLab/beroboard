import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { deleteProjectModel } from "./delete-project.model";
import { deleteProjectUseCase } from "./delete-project.use-case";

export const deleteProjectRouter = new Elysia().use(authMiddleware).delete("/:id", ({ params, user }) => deleteProjectUseCase({ ...params, userId: user.id }), {
   params: deleteProjectModel,
   auth: true,
   detail: {
      summary: "Delete a project",
      description: "Delete a project by ID",
   },
});
