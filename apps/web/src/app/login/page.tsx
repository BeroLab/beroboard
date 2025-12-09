import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { SignInScreen } from "@/modules/auth/ui/screens/sign-in/sign-in-screen";

export default async function LoginPage() {
   const session = await authClient.getSession({
      fetchOptions: {
         headers: await headers(),
         throw: true,
      },
   });

   if (session?.user) {
      redirect("/dashboard");
   }
   return <SignInScreen />;
}
