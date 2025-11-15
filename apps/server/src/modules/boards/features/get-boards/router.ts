import Elysia from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { getBoardsModel, getBoardsResponseModel } from "./get-boards.model";
import { getBoardsUseCase } from "./get-boards.use-case";

export const getBoardsRouter = new Elysia()
   .use(authMiddleware)
   .get("/", ({ query, params, user }) => getBoardsUseCase({ ...query, ...params, userId: user.id }), {
      query: getBoardsModel,
      response: {
         "200": getBoardsResponseModel,
      },
      auth: true,
      detail: {
         summary: "Get all boards",
         description: "Get all boards for a project",
      },
   });
