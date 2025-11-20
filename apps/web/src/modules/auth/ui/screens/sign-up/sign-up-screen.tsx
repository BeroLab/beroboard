"use client";
import Image from "next/image";
import { useSignUpForm } from "./hooks/useSignUpForm";
import { buildSignUpFormFields } from "./library/buildSignUpFormFields";
import { useMemo } from "react";
import { AuthForm } from "../../components/auth-form";
import { useSignUp } from "@/modules/auth/services/sign-up";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      <div className="flex flex-1 flex-col items-center justify-center h-full">
         <div className="mb-5">
            <Image src={"/logo.png"} width={350} height={150} alt="logo" />
         </div>

         <AuthForm onSubmit={onSubmit} control={control} fields={fields} loadingSubmit={isLoading} buttonText="Cadastrar" />

         <div className="flex flex-row mt-5">
            <span className="text-dracula-text-secondary">Já tem uma conta?</span>
            <a href="/login" className="ml-2 text-dracula-cyan hover:underline">
               Entrar
            </a>
         </div>
      </div>
   );
}
