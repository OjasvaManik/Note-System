'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface BannerProps {
  url: string | null;
  onChange: ( url: string | null ) => void;
}

export default function BannerComponent( { url, onChange }: BannerProps ) {
  const [ linkInput, setLinkInput ] = useState( "" );
  const [ isUploading, setIsUploading ] = useState( false );
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

  const getImageUrl = ( path: string | null ) => {
    if ( !path ) return null;
    if ( path.startsWith( 'http' ) ) return path;
    return `${ API_URL }${ path }`;
  }

  const handleFileUpload = async ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const file = e.target.files?.[ 0 ];
    if ( !file ) return;

    try {
      setIsUploading( true );
      const formData = new FormData();
      formData.append( 'file', file );
      const res = await fetch( `${ API_URL }/upload`, {
        method: 'POST',
        body: formData,
      } );

      if ( !res.ok ) throw new Error( 'Upload failed' );
      const data = await res.json();
      onChange( data.url );

    } catch ( error ) {
      console.error( "Upload error:", error );
    } finally {
      setIsUploading( false );
    }
  };

  const handleLinkSubmit = () => {
    if ( linkInput ) onChange( linkInput );
  };

  const handleRemove = async () => {
    if ( url && url.startsWith( '/uploads/' ) ) {
      try {
        const filename = url.split( '/' ).pop();

        if ( filename ) {
          await fetch( `${ API_URL }/upload/${ filename }`, {
            method: 'DELETE',
          } );
        }
        toast.success( 'Banner removed successfully!' )
      } catch ( error ) {
        toast.error( 'Failed to remove banner' );
      }
    }
    onChange( null );
  };

  return (
    <div className="group relative mb-1">
      { url ? (
        <div className="relative h-[35vh] bg-muted group w-screen ml-[50%] -translate-x-1/2">
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
      ) : (
        <div className="">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
                <ImageIcon className="h-4 w-4"/>
                Add Cover
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <Tabs defaultValue="link" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="link">Link</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="link" className="space-y-2">
                  <Input
                    placeholder="Paste image address..."
                    value={ linkInput }
                    onChange={ ( e ) => setLinkInput( e.target.value ) }
                  />
                  <Button size="sm" className="w-full" onClick={ handleLinkSubmit }>
                    Embed Link
                  </Button>
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        { isUploading ? (
                          <Loader2 className="w-8 h-8 mb-2 animate-spin text-primary"/>
                        ) : (
                          <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground"/>
                        ) }
                        <p className="text-sm text-muted-foreground">
                          { isUploading ? "Uploading..." : "Click to upload image" }
                        </p>
                      </div>
                      <Input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={ handleFileUpload }
                        disabled={ isUploading }
                      />
                    </label>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>
      ) }
    </div>
  )
}