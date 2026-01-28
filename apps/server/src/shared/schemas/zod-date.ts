import { z } from "zod";

import { overrideJSONSchema } from "../utils/override-zod-json-schema";

const datetime = z.union([z.iso.datetime(), z.date()]);

export const zDate = overrideJSONSchema(
	z.codec(datetime, datetime, {
		decode: (isoString) => new Date(isoString),
		encode: (date) => new Date(date).toISOString(),
	}),
	() => z.toJSONSchema(z.iso.datetime()),
);
