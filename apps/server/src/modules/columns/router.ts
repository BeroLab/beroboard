import { Elysia } from "elysia";

import { getColumnsRouter } from "./get-columns/router";

export const columnsRouter = new Elysia({
	prefix: "/columns",
	tags: ["columns"],
}).use(getColumnsRouter);
