import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { updateBoardModel, updateBoardParamsModel } from "./update-board.model";
import { updateBoardUseCase } from "./update-board.use-case";

export const updateBoardRouter = new Elysia()
   .use(authMiddleware)
   .patch("/:id", ({ params, body, user }) => updateBoardUseCase({ ...params, ...body, userId: user.id }), {
      params: updateBoardParamsModel,
      body: updateBoardModel,
      auth: true,
      detail: {
         summary: "Update a board",
         description: "Update a board by ID",
      },
   });
