'use client'

import React, { useCallback } from 'react'
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { debounce } from "lodash";
import { Block, PartialBlock } from "@blocknote/core";
import * as Badge from "@/components/ui/badge";
import * as Button from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import * as Popover from "@/components/ui/popover";
import * as Select from "@/components/ui/select";
import * as Tabs from "@/components/ui/tabs";
import * as Toggle from "@/components/ui/toggle";
import * as Tooltip from "@/components/ui/tooltip";

interface EditorProps {
  initialContent?: PartialBlock[];
  id: string;
}

const MyEditor = ( { initialContent, id }: EditorProps ) => {
  const { resolvedTheme } = useTheme();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

  const editor = useCreateBlockNote( {
    initialContent: initialContent,
  } );

  const saveContent = useCallback(
    // eslint-disable-next-line react-hooks/use-memo
    debounce( async ( json: Block[] ) => {
      await fetch( `${ API_URL }/${ id }`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { content: json } ),
      } );
    }, 1000 ),
    [ id, API_URL ]
  );

  return (
    <BlockNoteView
      editor={ editor }
      theme={ resolvedTheme === 'dark' ? 'dark' : 'light' }
      onChange={ () => {
        saveContent( editor.document );
      } }
      style={ {
        "--bn-colors-editor-background": "transparent",
        "--bn-colors-menu-border": "transparent",
      } as React.CSSProperties }
      className={ cn( 'h-full w-full' ) }
      shadCNComponents={ {
        Badge,
        Button,
        Card,
        DropdownMenu,
        Input,
        Label,
        Popover,
        Select,
        Tabs,
        Toggle,
        Tooltip,
      } }
    />
  )
}
export default MyEditor