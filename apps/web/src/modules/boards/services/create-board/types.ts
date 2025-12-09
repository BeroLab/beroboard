export interface CreateBoardDTO {
   name: string;
   description?: string;
   projectId: string;
   stages?: string[];
}
