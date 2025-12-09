"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type SignInSchema, signInSchema } from "../library/sign-in.schema";

type Props = {
   onSubmit: (data: SignInSchema) => void;
};
export function useSignInForm({ onSubmit }: Props) {
   const { control, handleSubmit, formState } = useForm<SignInSchema>({
      defaultValues: {
         email: "",
         password: "",
      },
      mode: "onChange",
      resolver: zodResolver(signInSchema),
   });

   return {
      control,
      formState,

      onSubmit: handleSubmit(onSubmit),
   };
}
