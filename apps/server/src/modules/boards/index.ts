import Elysia from "elysia";
import { createBoardRouter, deleteBoardRouter, getBoardRouter, getBoardsRouter, updateBoardRouter } from "./features";

export const boardsController = new Elysia({ prefix: "/boards", tags: ["boards"] }).use([
   createBoardRouter,
   getBoardsRouter,
   getBoardRouter,
   updateBoardRouter,
   deleteBoardRouter,
]);
