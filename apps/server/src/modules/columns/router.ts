import { Elysia } from "elysia";

import { createColumnRouter } from "./create-column/router";
import { deleteColumnRouter } from "./delete-column/router";
import { getColumnsRouter } from "./get-columns/router";
import { reorderColumnsRouter } from "./reorder-columns/router";
import { updateColumnRouter } from "./update-column/router";

export const columnsRouter = new Elysia({
	prefix: "/columns",
	tags: ["columns"],
})
	.use(getColumnsRouter)
	.use(createColumnRouter)
	.use(updateColumnRouter)
	.use(deleteColumnRouter)
	.use(reorderColumnsRouter);
