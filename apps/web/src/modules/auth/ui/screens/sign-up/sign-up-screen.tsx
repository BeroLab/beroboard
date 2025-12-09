"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { useSignUp } from "@/modules/auth/services/sign-up";
import { AuthForm } from "../../components/auth-form";
import { useSignUpForm } from "./hooks/useSignUpForm";
import { buildSignUpFormFields } from "./library/buildSignUpFormFields";

export function SignUpScreen() {
   const router = useRouter();
   const { signUp, isLoading } = useSignUp({
      onSuccess: () => {
         router.push("/dashboard");
         toast.success("Sign up successful");
      },
      onError: (error) => {
         toast.error(error.message);
      },
   });
   const { control, onSubmit } = useSignUpForm({
      onSubmit: signUp,
   });
   const fields = useMemo(() => buildSignUpFormFields(), []);
   return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
         <div className="mb-5">
            <Image src={"/logo.png"} width={350} height={150} alt="logo" />
         </div>

         <AuthForm onSubmit={onSubmit} control={control} fields={fields} loadingSubmit={isLoading} buttonText="Cadastrar" />

         <div className="mt-5 flex flex-row">
            <span className="text-dracula-text-secondary">Já tem uma conta?</span>
            <a href="/login" className="ml-2 text-dracula-cyan hover:underline">
               Entrar
            </a>
         </div>
      </div>
   );
}
