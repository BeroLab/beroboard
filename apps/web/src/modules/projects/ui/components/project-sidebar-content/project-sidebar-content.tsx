"use client";
import { ChevronDown, Plus } from "lucide-react";
import { BoardCreateHandler } from "@/modules/boards/ui/components/board-create-handler";
import { BoardSidebarContent } from "@/modules/boards/ui/components/board-sidebar-content";
import { useGetProjects } from "@/modules/projects/services/get-projects/useGetProjects";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton, SidebarMenuItem } from "@/shared/components/ui/sidebar";
import { modalManager } from "@/shared/services/modal-manager";
import { ProjectCreateHandler } from "../project-create-handler";

export function ProjectSidebarContent() {
   const { projects } = useGetProjects();

   return (
      <SidebarGroup>
         <SidebarGroupLabel>Projetos</SidebarGroupLabel>
         <SidebarGroupAction title="Add project">
            <Plus
               onClick={() => {
                  modalManager.open({
                     title: "Criar Projeto",
                     content: <ProjectCreateHandler />,
                  });
               }}
            />{" "}
            <span className="sr-only">Add Project</span>
         </SidebarGroupAction>

         <SidebarGroupContent>
            {projects?.map((project) => (
               <Collapsible key={project.id} defaultOpen className="group/collapsible">
                  <SidebarGroup>
                     <SidebarGroupLabel asChild>
                        <CollapsibleTrigger>
                           {project.name}
                           <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </CollapsibleTrigger>
                     </SidebarGroupLabel>
                     <SidebarGroupAction title="Add board" className="mr-5">
                        <Plus
                           onClick={() => {
                              modalManager.open({
                                 title: "Criar Board",
                                 content: <BoardCreateHandler projectID={project.id} />,
                              });
                           }}
                        />{" "}
                        <span className="sr-only">Add Project</span>
                     </SidebarGroupAction>
                     <CollapsibleContent>
                        <BoardSidebarContent projectId={project.id} />
                     </CollapsibleContent>
                  </SidebarGroup>
               </Collapsible>
            ))}
         </SidebarGroupContent>
      </SidebarGroup>
   );
}
