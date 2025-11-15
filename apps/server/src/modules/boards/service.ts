import { createBoardUseCase, deleteBoardUseCase, getBoardsUseCase, getBoardUseCase, updateBoardUseCase } from "./features";

export const BoardServiceImplementation = {
   create: createBoardUseCase,
   get: getBoardUseCase,
   getBoards: getBoardsUseCase,
   update: updateBoardUseCase,
   delete: deleteBoardUseCase,
};
