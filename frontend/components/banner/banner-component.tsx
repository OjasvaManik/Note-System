'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

import { API_URL, getImageUrl } from "@/lib/banner-utils"
import { BannerSearch } from "./banner-search"
import { BannerUpload } from "./banner-upload"
import { BannerLink } from "./banner-link"

interface BannerProps {
  url: string | null;
  onChange: ( url: string | null ) => void;
}

export default function BannerComponent( { url, onChange }: BannerProps ) {
  const [ isOpen, setIsOpen ] = useState( false );

  const handleRemove = async () => {
    if ( url && url.startsWith( '/uploads/' ) ) {
      try {
        await fetch( `${ API_URL }/upload/file`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify( { path: url } ),
        } );
        toast.success( 'Banner removed' );
      } catch ( error ) {
        toast.error( 'Failed to remove banner' );
      }
    }
    onChange( null );
  };

  // 1. View Mode (Banner exists)
  if ( url ) {
    return (
      <div className="group relative w-full mb-2">
        {/* Removed the ml-[50%] hack. Added w-full */ }
        <div className="relative h-[35vh] w-full bg-muted group overflow-hidden">
          <img
            src={ getImageUrl( url )! }
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <Button
            onClick={ handleRemove }
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X className="h-4 w-4"/>
          </Button>
        </div>
      </div>
    );
  }

  // 2. Picker Mode (No banner)
  return (
    <div className="group relative mb-8 px-8 lg:px-12 pt-8">
      <Popover open={ isOpen } onOpenChange={ setIsOpen }>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm"
                  className="gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ImageIcon className="h-4 w-4"/>
            Add Cover
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 lg:w-[30rem] p-0" align="start">
          <Tabs defaultValue="search" className="w-full">
            <div className="p-3 border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="link">Link</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="search" className="p-0">
              <BannerSearch onChange={ ( url ) => {
                onChange( url );
                setIsOpen( false );
              } }/>
            </TabsContent>

            <TabsContent value="upload" className="p-3">
              <BannerUpload onChange={ ( url ) => {
                onChange( url );
                setIsOpen( false );
              } }/>
            </TabsContent>

            <TabsContent value="link" className="p-3">
              <BannerLink onChange={ ( url ) => {
                onChange( url );
                setIsOpen( false );
              } }/>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}