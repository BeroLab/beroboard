import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { getProjectModel, getProjectResponseModel } from "./get-project.model";
import { getProjectUseCase } from "./get-project.use-case";

export const getProjectRouter = new Elysia().use(authMiddleware).get("/:id", ({ params, user }) => getProjectUseCase({ ...params, userId: user.id }), {
   params: getProjectModel,

   auth: true,
   detail: {
      summary: "Get a project",
      description: "Get a project by ID",
   },
});
