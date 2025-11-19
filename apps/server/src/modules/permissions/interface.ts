import { container } from "@/lib/dependency-injection/container";
import { createToken } from "@/lib/dependency-injection/token";
import * as features from "./features/user-can-access-resource";

interface PermissionServiceType {
   userCanAccessResource: (params: {
      resourceType: features.UserCanAccessResourceModel["resourceType"];
      resourceId: string;
      userId: string;
      operation: features.UserCanAccessResourceModel["operation"];
   }) => Promise<boolean>;
}

const PermissionServiceImplementation: PermissionServiceType = {
   userCanAccessResource: features.userCanAccessResourceUseCase,
};

export const PermissionService = createToken<PermissionServiceType>("PermissionService");
container.register(PermissionService, PermissionServiceImplementation);
