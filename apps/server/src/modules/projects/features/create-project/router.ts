import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { createProjectModel, createProjectResponseModel } from "./create-project.model";
import { createProjectUseCase } from "./create-project.use-case";

export const createProjectRouter = new Elysia().use(authMiddleware).post("/", ({ body, user }) => createProjectUseCase({ ...body, userId: user.id }), {
   body: createProjectModel,
   response: {
      "201": createProjectResponseModel,
   },
   auth: true,
   detail: {
      summary: "Create a new project",
      description: "Create a new project",
   },
});
