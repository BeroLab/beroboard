export interface TaskApi {
   id: string;
   title: string;
   description: string;
   createdAt: Date;
   updatedAt: Date;
   createdByUserId: string;
   assignedToUserId: string;
}
