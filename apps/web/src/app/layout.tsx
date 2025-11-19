import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import Header from "@/shared/components/header";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/layout/app-sidebar/app-sidebar";
import Providers from "@/shared/providers/providers";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "beroboard",
   description: "beroboard",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Providers>
               <SidebarProvider>
                  <AppSidebar />
                  <main className="bg-dracula-background flex flex-1 flex-col p-5">

                     <SidebarTrigger />
                     {children}
                  </main>
               </SidebarProvider>
            </Providers>
         </body>
      </html>
   );
}
