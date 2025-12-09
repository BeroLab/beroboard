import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";

import Providers from "@/shared/providers/providers";
import { ModalManager } from "@/shared/services/modal-manager/components";

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
               <main className="flex h-dvh flex-1 flex-col bg-dracula-background">
                  {children}
                  <ModalManager />
               </main>
            </Providers>
         </body>
      </html>
   );
}
