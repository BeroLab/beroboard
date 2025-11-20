import { authClient } from "@/lib/auth-client";
import { SignUpScreen } from "@/modules/auth/ui/screens/sign-up";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
   const session = await authClient.getSession({
      fetchOptions: {
         headers: await headers(),
         throw: true,
      },
   });

   if (session?.user) {
      redirect("/dashboard");
   }
   return <SignUpScreen />;
}
