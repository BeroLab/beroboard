import { z } from "zod";

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const zHexColor = z.string().regex(hexColorRegex, {
	message: "Must be a valid 6-digit hex color code (e.g., #FF0000)",
});
