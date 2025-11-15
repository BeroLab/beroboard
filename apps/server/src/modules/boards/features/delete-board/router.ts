import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { deleteBoardParamsModel, deleteBoardQueryParamsModel } from "./delete-board.model";
import { deleteBoardUseCase } from "./delete-board.use-case";

export const deleteBoardRouter = new Elysia()
   .use(authMiddleware)
   .delete("/:id", ({ params, query, user }) => deleteBoardUseCase({ ...params, ...query, userId: user.id }), {
      params: deleteBoardParamsModel,
      query: deleteBoardQueryParamsModel,
      auth: true,
      detail: {
         summary: "Delete a board",
         description: "Delete a board by ID",
      },
   });
