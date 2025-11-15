import type { UserRole } from "../../db/prisma/generated/enums";

export type Role = UserRole; // "USER" | "ADMIN"
export const Roles: Record<Role, Role> = {
   USER: "USER",
   ADMIN: "ADMIN",
};
