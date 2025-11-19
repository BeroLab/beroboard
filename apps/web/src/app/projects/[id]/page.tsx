import { findProjectByService } from "@/modules/projects/services/find-project-by";
import { ProjectScreen } from "@/modules/projects/ui/screens/project-screen";

type Props = {
   params: {
      id: string;
   };
};

export default async function ProjectPage({ params }: Props) {
   const { id } = await params;

   const result = await findProjectByService({ id });

   console.log("ID", id, result);
   return <ProjectScreen />;
}
