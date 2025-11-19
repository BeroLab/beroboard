import path from "node:path";
import { fileURLToPath } from "bun";
import dotenv from "dotenv";
import { PrismaClient } from "../prisma/generated/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
   path: path.join(__dirname, "../../../apps/server/.env"),
});

const prisma: PrismaClient = new PrismaClient();

export default prisma;
export type { PrismaClient };
