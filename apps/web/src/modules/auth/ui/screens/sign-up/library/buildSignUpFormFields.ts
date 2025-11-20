import type { AuthFormFields } from "../../../components/auth-form";
import type { SignUpSchema } from "./sign-up.schema";

export function buildSignUpFormFields(): AuthFormFields<SignUpSchema>[] {
   return [
      {
         type: "default",
         props: {
            name: "username",
            label: "Usuário",
         },
      },
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
            label: "Senha",
            name: "password",
         },
      },
   ];
}
