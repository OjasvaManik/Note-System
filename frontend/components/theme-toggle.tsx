"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [ mounted, setMounted ] = React.useState( false )

  React.useEffect( () => {
    setMounted( true )
  }, [] )

  if ( !mounted ) {
    return null
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="flex items-center bg-transparent p-2 rounded-full">
      <button
        type="button"
        role="switch"
        aria-checked={ isDark }
        onClick={ () => setTheme( isDark ? "light" : "dark" ) }
        className={ `
          relative inline-flex w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
          ${ isDark ? "bg-primary" : "bg-input" }
        ` }
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={ `
            pointer-events-none flex items-center justify-center h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out
            ${ isDark ? "translate-x-5" : "translate-x-0" }
          ` }
        >
          { isDark ? (
            <Moon className="h-3 w-3 text-foreground"/>
          ) : (
            <Sun className="h-3 w-3 text-foreground"/>
          ) }
        </span>
      </button>
    </div>
  )
}