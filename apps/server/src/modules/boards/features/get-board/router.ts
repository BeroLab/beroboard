import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { getBoardModel, getBoardResponseModel } from "./get-board.model";
import { getBoardUseCase } from "./get-board.use-case";

export const getBoardRouter = new Elysia().use(authMiddleware).get("/:id", ({ params, user }) => getBoardUseCase({ ...params, userId: user.id }), {
   params: getBoardModel,
   response: {
      "200": getBoardResponseModel,
   },
   auth: true,
   detail: {
      summary: "Get a board",
      description: "Get a board by ID",
   },
});
