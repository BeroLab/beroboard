import { Calendar, Home, Inbox, Plus, Search, Settings, Settings2 } from "lucide-react";
import { ProjectSidebarContent } from "@/modules/projects/ui/components/project-sidebar-content";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupAction,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

export function AppSidebar() {
   return (
      <Sidebar >
         <SidebarHeader>
            <h1>BeroBoard</h1>
         </SidebarHeader>
         <SidebarContent>
            <ProjectSidebarContent />
         </SidebarContent>
         <SidebarFooter>
            <SidebarGroupContent>
               <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                     <div>
                        <Settings2 />
                        <span>Settings</span>
                     </div>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarGroupContent>
         </SidebarFooter>
      </Sidebar>
   );
}
