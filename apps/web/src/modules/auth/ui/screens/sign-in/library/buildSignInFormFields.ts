import type { AuthFormFields } from "@/modules/auth/ui/components/auth-form";
import type { SignInSchema } from "./sign-in.schema";

export function buildSignInFormFields(): AuthFormFields<SignInSchema>[] {
   return [
      {
         type: "default",
         props: {
            name: "email",
            label: "Email",
         },
      },
      {
         type: "security",
         props: {
            label: "Password",
            name: "password",
         },
      },
   ];
}
