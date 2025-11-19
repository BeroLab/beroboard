import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { deleteStageModel } from "./delete-stage.model";
import { deleteStageUseCase } from "./delete-stage.use-case";

export const deleteStageRouter = new Elysia().use(authMiddleware).delete("/:id", ({ params, user }) => deleteStageUseCase({ ...params, userId: user.id }), {
   params: deleteStageModel,
   auth: true,
   detail: {
      summary: "Delete a stage",
      description: "Delete a stage by ID",
   },
});

