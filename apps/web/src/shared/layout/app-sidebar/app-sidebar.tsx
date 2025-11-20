import { Settings2 } from "lucide-react";
import { ProjectSidebarContent } from "@/modules/projects/ui/components/project-sidebar-content";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupContent, SidebarHeader, SidebarMenuButton, SidebarMenuItem } from "@/shared/components/ui/sidebar";
import Image from "next/image";

export function AppSidebar() {
   return (
      <Sidebar className="border-dracula-surface/50 border-r-2">
         <SidebarHeader className="items-center justify-center">
            <Image src={'/logo.png'} alt="BeroBoard Logo" width={200} height={150} />
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
