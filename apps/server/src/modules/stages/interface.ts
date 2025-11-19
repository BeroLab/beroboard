import { container } from "@/lib/dependency-injection/container";
import { createToken } from "@/lib/dependency-injection/token";
import type {
   CreateStageModel,
   CreateStageResponseModel,
   DeleteStageModel,
   GetStageModel,
   GetStageResponseModel,
   GetStagesModel,
   GetStagesResponseModel,
   UpdateStageModel,
   UpdateStageResponseModel,
} from "./features";
import { StageServiceImplementation } from "./service";

interface StageServiceType {
   create: (stage: CreateStageModel) => Promise<CreateStageResponseModel>;
   get: (params: GetStageModel) => Promise<GetStageResponseModel>;
   getStages: (query: GetStagesModel) => Promise<GetStagesResponseModel>;
   update: (params: UpdateStageModel) => Promise<UpdateStageResponseModel>;
   delete: (params: DeleteStageModel) => Promise<void>;
}

export const StageService = createToken<StageServiceType>("StageService");
container.register(StageService, StageServiceImplementation);
