import Elysia from "elysia";
import { NotFoundError } from "./not-found.error";

export const errorsRegister = new Elysia()
   .error({
      NotFoundError,
   })
   .onError(({ error, code, status }) => {
      if (code !== "UNKNOWN") return;
      if ("status" in error && typeof error.status === "number") return status(error.status, error.message);

      if (typeof (error as unknown as { toResponse?: () => unknown }).toResponse === "function")
         return (error as unknown as { toResponse: () => unknown }).toResponse();

      return status(500, "Internal server error");
   });
