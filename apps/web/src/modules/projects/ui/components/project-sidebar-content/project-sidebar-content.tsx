"use client";
import { ChevronDown, Hash, Plus } from "lucide-react";
import { useState } from "react";
import type { ProjectApi } from "@/modules/projects/domain/project.model";
import { useGetProjects } from "@/modules/projects/services/get-projects/useGetProjects";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton, SidebarMenuItem } from "@/shared/components/ui/sidebar";
import { ProjectCreateHandler } from "../project-create-handler";
import Link from "next/link";

export function ProjectSidebarContent() {
   const { projects } = useGetProjects();

   const [openModal, setOpenModal] = useState(false);
   return (
      <>
         <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
               <SidebarGroupLabel asChild>
                  <CollapsibleTrigger>
                     Projetos
                     <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
               </SidebarGroupLabel>
               <SidebarGroupAction title="Add project" className="mr-5">
                  <Plus onClick={() => setOpenModal(true)} /> <span className="sr-only">Add Project</span>
               </SidebarGroupAction>
               <CollapsibleContent>
                  <SidebarGroupContent>
                     {projects &&
                        projects.map((project) => (
                           <SidebarMenuItem key={project.id}>
                              <SidebarMenuButton asChild>
                                 <ProjectSideBarContentItem project={project} />
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        ))}
                  </SidebarGroupContent>
               </CollapsibleContent>
            </SidebarGroup>
         </Collapsible>
         <ProjectCreateHandler open={openModal} onOpenChange={setOpenModal} />
      </>
   );
}

export function ProjectSideBarContentItem({ project }: { project: ProjectApi }) {
   return (
      <Link href={`/projects/${project.id}`}>
         <div className="flex gap-1 px-2 py-1 flex-row items-center rounded-lg cursor-pointer hover:bg-dracula-surface/25">
            <Hash className="text-dracula-pink" size={20} />
            <span className="text-md font-semibold">{project.name}</span>
         </div>
      </Link>
   );
}
