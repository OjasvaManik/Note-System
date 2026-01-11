"use client";

import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { EmojiMartEmoji } from "@/types/types";

interface EmojiPickerProps {
  onSelect: ( emoji: EmojiMartEmoji ) => void;
  currentEmoji: string | null;
}

export default function EmojiPickerComponent( { onSelect, currentEmoji }: EmojiPickerProps ) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={ 'ghost' }
          className="h-20 w-20 transition-colors"
        >
          { currentEmoji ? (
            <span className="text-6xl">{ currentEmoji }</span>
          ) : (
            <PlusIcon className="h-8 w-8 text-muted-foreground"/>
          ) }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-0 bg-transparent shadow-none w-full p-0">
        <EmojiPicker
          data={ data }
          onEmojiSelect={ onSelect }
          theme="light"
        />
      </PopoverContent>
    </Popover>
  );
}