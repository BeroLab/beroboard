import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { updateStageModel } from "./update-stage.model";
import { updateStageUseCase } from "./update-stage.use-case";

export const updateStageRouter = new Elysia().use(authMiddleware).patch(
   "/:id",
   ({ params, body, user }) => {
      return updateStageUseCase({ ...params, ...body, userId: user.id });
   },
   {
      params: updateStageModel,
      body: updateStageModel,
      auth: true,
      detail: {
         summary: "Update a stage",
         description: "Update a stage by ID",
      },
   },
);

