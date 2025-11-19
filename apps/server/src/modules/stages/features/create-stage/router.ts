import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { createStageModel, createStageResponseModel } from "./create-stage.model";
import { createStageUseCase } from "./create-stage.use-case";

export const createStageRouter = new Elysia().use(authMiddleware).post("/", ({ body, user }) => createStageUseCase({ ...body, userId: user.id }), {
   body: createStageModel,
   response: {
      "201": createStageResponseModel,
   },
   auth: true,
   detail: {
      summary: "Create a new stage",
      description: "Create a new stage",
   },
});

