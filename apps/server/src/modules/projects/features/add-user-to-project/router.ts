import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { addUserToProjectModel, addUserToProjectParamsModel } from "./add-user-to-project.model";
import { addUserToProjectUseCase } from "./add-user-to-project.use-case";

export const addUserToProjectRouter = new Elysia()
   .use(authMiddleware)
   .post("/:id/users", ({ body, params, user }) => addUserToProjectUseCase({ ...body, ...params, ownerId: user.id }), {
      params: addUserToProjectParamsModel,
      body: addUserToProjectModel,
      auth: true,
      detail: {
         summary: "Add a user to a project",
         description: "Add a user to a project by ID",
      },
   });
