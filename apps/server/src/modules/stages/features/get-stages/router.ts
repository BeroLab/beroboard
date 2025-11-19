import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { getStagesModel } from "./get-stages.model";
import { getStagesUseCase } from "./get-stages.use-case";

export const getStagesRouter = new Elysia().use(authMiddleware).get(
   "/",
   ({ query, user }) => {
      return getStagesUseCase({ ...query, userId: user.id });
   },
   {
      query: getStagesModel,
      auth: true,
      detail: {
         summary: "Get all stages",
         description: "Get all stages",
      },
   },
);

