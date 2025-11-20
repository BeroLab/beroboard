"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { signUpSchema, type SignUpSchema } from "../library/sign-up.schema";

type Props = {
   onSubmit: (data: SignUpSchema) => void;
};

export function useSignUpForm({ onSubmit }: Props) {
   const { control, handleSubmit, formState } = useForm<SignUpSchema>({
      defaultValues: {
         email: "",
         password: "",
         name: "",
      },
      mode: "onChange",
      resolver: zodResolver(signUpSchema),
   });

   return {
      control,
      formState,
      onSubmit: handleSubmit(onSubmit),
   };
}
