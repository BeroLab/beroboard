export class NotFoundError extends Error {
   status = 404;
   constructor(entity: string) {
      super(`${entity} not found`);
      this.name = "NotFoundError";
   }
   toResponse() {
      return {
         message: this.message,
      };
   }
}
