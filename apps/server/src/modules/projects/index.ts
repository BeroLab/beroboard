import Elysia from "elysia";
import { addUserToProjectRouter, createProjectRouter, deleteProjectRouter, getProjectRouter, getProjectsRouter, updateProjectRouter } from "./features";

export const projectsController = new Elysia({ prefix: "/projects", tags: ["projects"] }).use([
   createProjectRouter,
   getProjectsRouter,
   getProjectRouter,
   updateProjectRouter,
   deleteProjectRouter,
   addUserToProjectRouter,
]);
