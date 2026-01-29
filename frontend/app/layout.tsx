import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { righteous } from "@/types/fonts";
import NavBar from "@/components/nav-bar";
import GetNotes from "@/components/get-notes";

export const metadata: Metadata = {
  title: "Note System",
  description: "Write your notes in a beautiful way.",
  icons: {
    icon: "/icon-dark.png",
  },
};

export default function RootLayout( {
                                      children,
                                    }: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en" suppressHydrationWarning={ true }>
    <body className={ `${ righteous.className } antialiased h-screen flex flex-col overflow-hidden` }>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Top Navigation */ }
      <div className="px-2 pt-3">
        <NavBar/>
      </div>

      {/* Main Layout Area */ }
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar: Hidden on mobile, visible on lg+ */ }
        <aside
          className="hidden lg:flex w-120 flex-col overflow-y-auto border-r border-accent mb-2 px-3 space-y-4 border-dotted mr-2">
          <GetNotes/>
        </aside>

        {/* Content: Takes the rest of the space */ }
        <main className="flex-1 overflow-y-auto">
          { children }
        </main>

      </div>

      <Toaster position="bottom-right"/>
    </ThemeProvider>
    </body>
    </html>
  );
}