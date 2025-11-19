import Elysia from "elysia";
import { createStageRouter, deleteStageRouter, getStageRouter, getStagesRouter, updateStageRouter } from "./features";

export const stagesController = new Elysia({ prefix: "/stages", tags: ["stages"] }).use([
   createStageRouter,
   getStagesRouter,
   getStageRouter,
   updateStageRouter,
   deleteStageRouter,
]);
