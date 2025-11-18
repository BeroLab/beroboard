export interface ProjectApi {
   id: string;
   createdAt: Date;
   updatedAt: Date;
   name: string;
   description: string;
   deletedAt: Date | null;
   createdByUserId: string;
}
