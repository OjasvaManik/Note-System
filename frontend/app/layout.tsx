import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { righteous } from "@/types/fonts";
import NavBar from "@/components/nav-bar";

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
    <body
      // Applying righteous.className forces the font globally
      className={ `${ righteous.className } antialiased py-3 px-2 lg:w-4xl mx-auto` }
    >
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NavBar/>
      { children }
      <Toaster position="bottom-right"/>
    </ThemeProvider>
    </body>
    </html>
  );
}
