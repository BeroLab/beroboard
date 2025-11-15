import { container } from "@/lib/dependency-injection/container";
import { createToken } from "@/lib/dependency-injection/token";
import type {
   CreateBoardModel,
   CreateBoardResponseModel,
   DeleteBoardModel,
   GetBoardModel,
   GetBoardResponseModel,
   GetBoardsModel,
   GetBoardsResponseModel,
   UpdateBoardModel,
   UpdateBoardResponseModel,
} from "./features";
import { BoardServiceImplementation } from "./service";

interface BoardServiceType {
   create: (board: CreateBoardModel) => Promise<CreateBoardResponseModel>;
   get: (params: GetBoardModel) => Promise<GetBoardResponseModel>;
   getBoards: (query: GetBoardsModel) => Promise<GetBoardsResponseModel>;
   update: (params: UpdateBoardModel) => Promise<UpdateBoardResponseModel>;
   delete: (params: DeleteBoardModel) => Promise<void>;
}

export const BoardService = createToken<BoardServiceType>("BoardService");
container.register(BoardService, BoardServiceImplementation);
