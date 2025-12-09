import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { MutationProps } from "@/shared/config/types";
import type { SignInDTO } from "./types";

export function useSignIn(config: MutationProps<void>) {
   const [isLoading, setIsLoading] = useState(false);
   async function signIn(dto: SignInDTO) {
      setIsLoading(true);

      try {
         await authClient.signIn.email(
            {
               email: dto.email,
               password: dto.password,
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
      signIn,
   };
}
