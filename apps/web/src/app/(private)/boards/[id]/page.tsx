import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { BoardScreen } from "@/modules/boards/ui/screens/board-screen";

type Props = {
   params: {
      id: string;
   };
};

export default async function BoardPage({ params }: Props) {
   const session = await authClient.getSession({
      fetchOptions: {
         headers: await headers(),
         throw: true,
      },
   });

   if (!session?.user) {
      redirect("/login");
   }
   const { id } = await params;

   return <BoardScreen id={id} />;
}
