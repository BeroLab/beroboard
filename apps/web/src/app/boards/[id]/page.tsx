import { BoardScreen } from "@/modules/boards/ui/screens/board-screen";

type Props = {
   params: {
      id: string;
   };
};

export default async function BoardPage({ params }: Props) {
   const { id } = await params;

   return <BoardScreen id={id} />;
}
