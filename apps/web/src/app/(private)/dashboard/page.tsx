import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { DashboardScreen } from "@/modules/projects/ui/screens/dashboard-screen";

export default async function DashboardPage() {
   const session = await authClient.getSession({
      fetchOptions: {
         headers: await headers(),
         throw: true,
      },
   });

   if (!session?.user) {
      redirect("/login");
   }

   return <DashboardScreen />;
}
