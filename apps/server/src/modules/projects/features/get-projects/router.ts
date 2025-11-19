import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { getProjectsModel } from "./get-projects.model";
import { getProjectsUseCase } from "./get-projects.use-case";

export const getProjectsRouter = new Elysia().use(authMiddleware).get(
   "/",
   ({ query, user }) => {
      return getProjectsUseCase({ ...query, userId: user.id });
   },
   {
      query: getProjectsModel,
      auth: true,
      detail: {
         summary: "Get all projects",
         description: "Get all projects",
      },
   },
);
