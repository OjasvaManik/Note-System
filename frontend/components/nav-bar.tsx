import React from "react";
import { ThemeToggle } from "./theme-toggle";
import TextType from "@/components/TextType";
import { cn } from "@/lib/utils";
import { bebasNeue } from "@/types/fonts";

const NavBar = () => {
  return (
    <div className="relative flex w-full items-center justify-between">
      <a href={ '/' }>
        <TextType
          text={ [ "Unitrix", "Note System" ] }
          typingSpeed={ 75 }
          pauseDuration={ 1500 }
          showCursor={ true }
          cursorCharacter="_"
          className={ cn( bebasNeue.className, 'text-4xl lg:text-5xl uppercase' ) }
        />
      </a>
      <ThemeToggle/>
    </div>
  );
};

export default NavBar;
