'use client'

import GetNotes from "@/components/get-notes";
import { NoNotes } from "@/components/no-notes";

export default function Home() {
  return (
    // FIXED: Single line string
    <div
      className="h-full w-full p-4 overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

      {/* MOBILE VIEW */ }
      <div className="lg:hidden h-full">
        <GetNotes/>
      </div>

      {/* DESKTOP VIEW */ }
      <div className="hidden lg:flex h-full flex-col items-center justify-center text-muted-foreground opacity-50">
        <NoNotes/>
      </div>

    </div>
  );
}