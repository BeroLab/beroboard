import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default async function Home() {
   const session = await authClient.getSession({
      fetchOptions: {
         headers: await headers(),
         throw: true,
      },
   });

   if (session?.user) {
      redirect("/dashboard");
   } else {
      return redirect("/login");
   }
}
