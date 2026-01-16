'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, Search, UploadCloud, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";

interface BannerProps {
  url: string | null;
  onChange: ( url: string | null ) => void;
}

export default function BannerComponentOld( { url, onChange }: BannerProps ) {
  const [ linkInput, setLinkInput ] = useState( "" );
  const [ isUploading, setIsUploading ] = useState( false );

  // Search State
  const [ searchQuery, setSearchQuery ] = useState( "" );
  const [ searchResults, setSearchResults ] = useState<string[]>( [] );
  const [ page, setPage ] = useState( 1 );
  const [ isLoadingImages, setIsLoadingImages ] = useState( false );
  const debouncedSearchQuery = useDebounce( searchQuery, 500 );

  const observer = useRef<IntersectionObserver | null>( null );
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

  // Infinite Scroll Trigger
  const lastImageElementRef = useCallback( ( node: HTMLDivElement ) => {
    if ( isLoadingImages ) return;
    if ( observer.current ) observer.current.disconnect();

    observer.current = new IntersectionObserver( entries => {
      if ( entries[ 0 ].isIntersecting && searchResults.length > 0 ) {
        setPage( prev => prev + 1 );
      }
    } );

    if ( node ) observer.current.observe( node );
  }, [ isLoadingImages, searchResults ] );

  // Fetch Logic
  useEffect( () => {
    // Check debouncedQuery, not searchQuery
    if ( !debouncedSearchQuery ) return;

    const fetchImages = async () => {
      setIsLoadingImages( true );
      try {
        // Use debouncedSearchQuery here
        const res = await fetch( `${ API_URL }/search-images?q=${ debouncedSearchQuery }&page=${ page }` );
        if ( !res.ok ) throw new Error( "Backend error" ); // Catch non-200 responses
        const newImages = await res.json();

        setSearchResults( prev => page === 1 ? newImages : [ ...prev, ...newImages ] );
      } catch ( err ) {
        toast.error( "Failed to load images" );
      } finally {
        setIsLoadingImages( false );
      }
    };

    fetchImages();

  }, [ page, debouncedSearchQuery ] );

  const handleSearchSubmit = ( e: React.FormEvent ) => {
    e.preventDefault();
    setPage( 1 );
    setSearchResults( [] );
    // Trigger useEffect by reference, or call fetch directly here.
    // Since searchQuery is in dep array, just ensuring state is set works.
  };

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
        await fetch( `${ API_URL }/upload/file`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify( { path: url } ),
        } );
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
            <PopoverContent className="w-[500px] p-0" align="start"> {/* Increased width for grid */ }
              <Tabs defaultValue="search" className="w-full">
                <div className="p-3 border-b">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="search">Search</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="link">Link</TabsTrigger>
                  </TabsList>
                </div>

                {/* --- Search Tab --- */ }
                <TabsContent value="search" className="p-3 mt-0">
                  <form onSubmit={ handleSearchSubmit } className="flex gap-2 mb-4">
                    <Input
                      placeholder="Search for an image..."
                      value={ searchQuery }
                      onChange={ ( e ) => setSearchQuery( e.target.value ) }
                    />
                    <Button type="submit" size="icon" variant="secondary">
                      <Search className="h-4 w-4"/>
                    </Button>
                  </form>

                  <div className="grid grid-cols-3 gap-2 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    { searchResults.map( ( imgUrl, index ) => {
                      // Attach ref to the last element to trigger infinite scroll
                      if ( index === searchResults.length - 1 ) {
                        return (
                          <div
                            ref={ lastImageElementRef }
                            key={ imgUrl }
                            className="aspect-video relative cursor-pointer group rounded-md overflow-hidden"
                            onClick={ () => onChange( imgUrl ) }
                          >
                            <img src={ imgUrl } alt="Result"
                                 className="w-full h-full object-cover hover:scale-105 transition-transform"/>
                          </div>
                        )
                      }
                      return (
                        <div
                          key={ imgUrl }
                          className="aspect-video relative cursor-pointer group rounded-md overflow-hidden"
                          onClick={ () => onChange( imgUrl ) }
                        >
                          <img src={ imgUrl } alt="Result"
                               className="w-full h-full object-cover hover:scale-105 transition-transform"/>
                        </div>
                      )
                    } ) }
                    { isLoadingImages && (
                      <div className="col-span-3 flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                      </div>
                    ) }
                    { !isLoadingImages && searchResults.length === 0 && searchQuery && (
                      <p className="col-span-3 text-center text-sm text-muted-foreground py-8">No results found.</p>
                    ) }
                  </div>
                </TabsContent>

                {/* --- Upload Tab --- */ }
                <TabsContent value="upload" className="p-3 mt-0 space-y-2">
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
                        accept="image/*,video/*"
                        onChange={ handleFileUpload }
                        disabled={ isUploading }
                      />
                    </label>
                  </div>
                </TabsContent>

                {/* --- Link Tab --- */ }
                <TabsContent value="link" className="p-3 mt-0 space-y-2">
                  <Input
                    placeholder="Paste image address..."
                    value={ linkInput }
                    onChange={ ( e ) => setLinkInput( e.target.value ) }
                  />
                  <Button size="sm" className="w-full" onClick={ handleLinkSubmit }>
                    Embed Link
                  </Button>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>
      ) }
    </div>
  )
}