'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Loader2, UploadCloud } from "lucide-react"
import { toast } from "sonner"
import { API_URL } from "@/lib/banner-utils"

interface BannerUploadProps {
  onChange: ( url: string ) => void;
}

export function BannerUpload( { onChange }: BannerUploadProps ) {
  const [ isUploading, setIsUploading ] = useState( false );

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
      toast.error( "Failed to upload image" );
    } finally {
      setIsUploading( false );
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
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
          accept="image/*,video/*"
          onChange={ handleFileUpload }
          disabled={ isUploading }
        />
      </label>
    </div>
  );
}