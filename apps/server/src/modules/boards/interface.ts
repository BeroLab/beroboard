import { container } from "@/lib/dependency-injection/container";
import { createToken } from "@/lib/dependency-injection/token";
import * as features from "./features";

interface BoardServiceType {
   create: (board: features.CreateBoardModel) => Promise<features.CreateBoardResponseModel>;
   get: (params: features.GetBoardModel) => Promise<features.GetBoardResponseModel>;
   getBoards: (query: features.GetBoardsModel) => Promise<features.GetBoardsResponseModel>;
   update: (params: features.UpdateBoardModel) => Promise<features.UpdateBoardResponseModel>;
   delete: (params: features.DeleteBoardModel) => Promise<void>;
}

const BoardServiceImplementation: BoardServiceType = {
   create: features.createBoardUseCase,
   get: features.getBoardUseCase,
   getBoards: features.getBoardsUseCase,
   update: features.updateBoardUseCase,
   delete: features.deleteBoardUseCase,
};

export const BoardService = createToken<BoardServiceType>("BoardService");
container.register(BoardService, BoardServiceImplementation);
