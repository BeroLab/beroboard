import { authClient } from "@/lib/auth-client";
import type { SignInDTO } from "./types";
import type { MutationProps } from "@/shared/config/types";
import { useState } from "react";

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
