export interface BoardApi {
   id: string;
   name: string;
   projectId: string;
   description: string;
   createdAt: Date;
   updatedAt: Date;
   deletedAt: Date | null;
}
