"use client";

import { useState, useEffect, Suspense } from "react";

import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { RightSidebar } from "@/components/RightSidebar";
import { AIChatBot } from "@/components/AIChatBot";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { IncomingCallListener } from "@/components/IncomingCallListener";

import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        inter.variable,
        cairo.variable,
        "bg-background min-h-screen text-foreground font-sans selection:bg-primary/10"
      )}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "setup-client-id"}>
          <AuthProvider>
            <LanguageProvider>
              <div className="flex h-screen overflow-hidden">

              
              {/* Desktop Sidebar */}
              <Sidebar className="hidden lg:flex w-64 shrink-0" />

              {/* Mobile Sidebar Overlay */}
              <div className={cn(
                "fixed inset-0 z-[100] lg:hidden transition-opacity duration-300",
                isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              )}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                <div className={cn(
                  "absolute top-0 bottom-0 left-0 w-72 bg-background transition-transform duration-300 ease-out shadow-2xl",
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                  <Sidebar onClose={() => setIsSidebarOpen(false)} />
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                
                {/* Mobile Menu Toggle (Injected into TopBar logic conceptually) */}
                <Suspense fallback={<div className="h-16 border-b bg-card animate-pulse" />}>
                  <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
                </Suspense>


                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex gap-8">
                  <div className="flex-1 max-w-4xl mx-auto w-full">
                    <Suspense fallback={
                      <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    }>
                      {children}
                    </Suspense>
                  </div>


                  {/* Desktop Right Sidebar */}
                  <RightSidebar className="hidden xl:block w-80 shrink-0 self-start sticky top-0" />
                </main>
              </div>
              <AIChatBot />
              <IncomingCallListener />
            </div>
          </LanguageProvider>

        </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
