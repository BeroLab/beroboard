import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/layout/app-sidebar/app-sidebar";

export default function PrivateLayout({ children }: React.PropsWithChildren) {
   return (
      <SidebarProvider>
         <AppSidebar />
         <div>
            <SidebarTrigger />
            {children}
         </div>
      </SidebarProvider>
   );
}
