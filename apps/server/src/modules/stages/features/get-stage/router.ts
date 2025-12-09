import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { getStageModel } from "./get-stage.model";
import { getStageUseCase } from "./get-stage.use-case";

export const getStageRouter = new Elysia().use(authMiddleware).get("/:id", ({ params, user }) => getStageUseCase({ ...params, userId: user.id }), {
   params: getStageModel,
   auth: true,
   detail: {
      summary: "Get a stage",
      description: "Get a stage by ID",
   },
});
