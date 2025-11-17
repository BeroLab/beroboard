import { ChevronDown, Hash, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenuButton, SidebarMenuItem } from "@/shared/components/ui/sidebar";

const projects = ["Project1", "Project2", "Project3"];
export function ProjectSidebarContent() {
   return (
      <Collapsible defaultOpen className="group/collapsible">
         <SidebarGroup>
            <SidebarGroupLabel asChild>
               <CollapsibleTrigger>
                  Projetos
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
               </CollapsibleTrigger>
            </SidebarGroupLabel>
            <SidebarGroupAction title="Add project" className="mr-5">
               <Plus /> <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <CollapsibleContent>
               <SidebarGroupContent>
                  {projects.map((project) => (
                     <SidebarMenuItem key={project}>
                        <SidebarMenuButton asChild>
                           <div>
                              <Hash className="text-blue-400" />
                              <span>{project}</span>
                           </div>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  ))}
               </SidebarGroupContent>
            </CollapsibleContent>
         </SidebarGroup>
      </Collapsible>
   );
}
