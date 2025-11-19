import { createStageUseCase, deleteStageUseCase, getStagesUseCase, getStageUseCase, updateStageUseCase } from "./features";

export const StageServiceImplementation = {
   create: createStageUseCase,
   get: getStageUseCase,
   getStages: getStagesUseCase,
   update: updateStageUseCase,
   delete: deleteStageUseCase,
};
