import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import Header from "@/shared/components/header";
import Providers from "@/shared/providers/providers";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { AppSidebar } from "@/shared/layout/app-sidebar/app-sidebar";

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
               <main>
                  {/*<Header />*/}
                  <SidebarTrigger />
                  {children}
               </main>
              </SidebarProvider>
            </Providers>
         </body>
      </html>
   );
}
