import Elysia, { status } from "elysia";
import { authMiddleware } from "@/modules/auth/auth.middleware";
import { createBoardModel, createBoardQueryParamsModel, createBoardResponseModel } from "./create-board.model";
import { createBoardUseCase } from "./create-board.use-case";

export const createBoardRouter = new Elysia().use(authMiddleware).post(
   "/",
   async ({ body, query, user }) => {
      const board = await createBoardUseCase({ ...body, projectId: query.projectId, userId: user.id });
      return status(201, board);
   },
   {
      body: createBoardModel,
      query: createBoardQueryParamsModel,
      response: {
         "201": createBoardResponseModel,
      },
      auth: true,
      detail: {
         summary: "Create a new board",
         description: "Create a new board for a project",
      },
   },
);
