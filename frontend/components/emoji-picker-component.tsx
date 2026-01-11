"use client";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type EmojiMartEmoji = {
  native: string;
  id: string;
};

interface EmojiPickerProps {
  onSelect: ( emoji: EmojiMartEmoji ) => void;
}

export default function EmojiPicker( { onSelect }: EmojiPickerProps ) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button><PlusIcon/></Button>
      </PopoverTrigger>
      <PopoverContent className={ 'border-0 bg-transparent' }>
        <Picker
          data={ data }
          onEmojiSelect={ onSelect }
          theme="light"
        />
      </PopoverContent>
    </Popover>
  );
}
