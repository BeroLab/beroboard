"use client";

import Image from "next/image";
import { AuthForm } from "../../components/auth-form";
import { useMemo } from "react";
import { buildSignInFormFields } from "./library/buildSignInFormFields";
import { useSignInForm } from "./hooks/useSignInForm";
import { useSignIn } from "@/modules/auth/services/sign-in";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SignInScreen() {
   const router = useRouter();
   const { signIn, isLoading } = useSignIn({
      onSuccess: () => {
         router.push("/dashboard");
         toast.success("Sign in successful");
      },
      onError: (error) => {
         toast.error(error.message);
      },
   });
   const { control, onSubmit } = useSignInForm({
      onSubmit: signIn,
   });
   const fields = useMemo(() => buildSignInFormFields(), []);
   return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
         <div className="mb-5">
            <Image src={"/logo.png"} width={350} height={150} alt="logo" />
         </div>

         <AuthForm onSubmit={onSubmit} control={control} fields={fields} loadingSubmit={isLoading} buttonText="Login" />

         <div className="mt-5 flex flex-row">
            <span className="text-dracula-text-secondary">Não tem uma conta? cadastrar-se.</span>
            <a href="/register" className="ml-2 text-dracula-cyan hover:underline">
               Registrar
            </a>
         </div>
      </div>
   );
}
