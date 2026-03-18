import { Elysia } from "elysia";
import { createLabelRouter } from "./create-label/router";
import { getLabelsRouter } from "./get-labels/router";
import { updateLabelRouter } from "./update-label/router";
import { deleteLabelRouter } from "./delete-label/router";

export const labelsRouter = new Elysia({
	prefix: "/labels",
	tags: ["labels"],
}).use([
  createLabelRouter,
  getLabelsRouter,
  updateLabelRouter,
  deleteLabelRouter,
]);
