import { authClient } from "@/lib/auth-client";

import type { MutationProps } from "@/shared/config/types";
import { useState } from "react";
import type { SignUpDTO } from "./types";

export function useSignUp(config: MutationProps<void>) {
   const [isLoading, setIsLoading] = useState(false);
   async function signUp(dto: SignUpDTO) {
      setIsLoading(true);

      try {
         await authClient.signUp.email(
            {
               email: dto.email,
               password: dto.password,
               name: dto.name,
            },
            {
               onSuccess: () => {
                  config.onSuccess?.();
               },
               onError: ({ error }) => {
                  config.onError?.(error);
               },
            },
         );
      } finally {
         setIsLoading(false);
      }
   }

   return {
      isLoading,
      signUp,
   };
}
