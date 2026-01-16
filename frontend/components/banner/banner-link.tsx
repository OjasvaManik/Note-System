'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BannerLinkProps {
  onChange: ( url: string ) => void;
}

export function BannerLink( { onChange }: BannerLinkProps ) {
  const [ linkInput, setLinkInput ] = useState( "" );

  const handleSubmit = () => {
    if ( linkInput ) onChange( linkInput );
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Paste image address..."
        value={ linkInput }
        onChange={ ( e ) => setLinkInput( e.target.value ) }
        onKeyDown={ ( e ) => e.key === 'Enter' && handleSubmit() }
      />
      <Button size="sm" className="w-full" onClick={ handleSubmit }>
        Embed Link
      </Button>
    </div>
  );
}