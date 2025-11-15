import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { updateProjectModel } from "./update-project.model";
import { updateProjectUseCase } from "./update-project.use-case";

export const updateProjectRouter = new Elysia().use(authMiddleware).patch(
   "/:id",
   ({ params, body, user }) => {
      return updateProjectUseCase({ ...params, ...body, userId: user.id });
   },
   {
      params: updateProjectModel,
      body: updateProjectModel,
      auth: true,
      detail: {
         summary: "Update a project",
         description: "Update a project by ID",
      },
   },
);
