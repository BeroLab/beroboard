import { ProjectScreen } from "@/modules/projects/ui/screens/project-screen";

type Props = {
   params: {
      id: string;
   };
};

export default async function ProjectPage({ params }: Props) {
   const { id } = await params;

   return <ProjectScreen id={id} />;
}
