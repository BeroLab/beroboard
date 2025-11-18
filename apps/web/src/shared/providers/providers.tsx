"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../components/ui/sonner";
import { queryClient } from "../config/query-client";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
   return (
      <QueryClientProvider client={queryClient}>
         <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster richColors />
         </ThemeProvider>
      </QueryClientProvider>
   );
}
