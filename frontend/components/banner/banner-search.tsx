'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/use-debounce"
import { API_URL, UnsplashImage } from "@/lib/banner-utils"

interface BannerSearchProps {
  onChange: ( url: string ) => void;
}

export function BannerSearch( { onChange }: BannerSearchProps ) {
  const [ searchQuery, setSearchQuery ] = useState( "" );
  const debouncedSearchQuery = useDebounce( searchQuery, 500 );

  const [ searchResults, setSearchResults ] = useState<UnsplashImage[]>( [] );
  const [ page, setPage ] = useState( 1 );
  const [ isLoading, setIsLoading ] = useState( false );

  // Use a Ref to strictly block duplicate fetches (better than state for rapid events)
  const isFetchingRef = useRef( false );
  const observer = useRef<IntersectionObserver | null>( null );

  // Infinite Scroll Trigger
  const lastImageRef = useCallback( ( node: HTMLDivElement ) => {
    if ( isLoading ) return;
    if ( observer.current ) observer.current.disconnect();

    observer.current = new IntersectionObserver( entries => {
      if ( entries[ 0 ].isIntersecting && searchResults.length > 0 ) {
        // Only increment if we aren't currently fetching
        if ( !isFetchingRef.current ) {
          setPage( prev => prev + 1 );
        }
      }
    } );

    if ( node ) observer.current.observe( node );
  }, [ isLoading, searchResults ] );

  // Fetch Logic
  useEffect( () => {
    if ( !debouncedSearchQuery ) return;

    // Strict Lock: Prevent multiple requests for the same page
    if ( isFetchingRef.current ) return;
    isFetchingRef.current = true;
    setIsLoading( true );

    const fetchImages = async () => {
      try {
        const res = await fetch( `${ API_URL }/search-images?q=${ debouncedSearchQuery }&page=${ page }` );
        if ( !res.ok ) throw new Error( "Backend error" );
        const newImages: UnsplashImage[] = await res.json();

        setSearchResults( prev => {
          // 1. If page 1, completely reset (fixes the 120 image stack issue)
          if ( page === 1 ) return newImages;

          // 2. Strict Deduplication using a Map
          const currentMap = new Map( prev.map( item => [ item.id, item ] ) );
          newImages.forEach( item => currentMap.set( item.id, item ) );

          return Array.from( currentMap.values() );
        } );

      } catch ( err ) {
        toast.error( "Failed to load images" );
      } finally {
        setIsLoading( false );
        isFetchingRef.current = false; // Unlock
      }
    };

    fetchImages();

    // Cleanup: If the user types fast and component unmounts/remounts, unlock
    return () => {
      isFetchingRef.current = false;
    };
  }, [ page, debouncedSearchQuery ] );

  const handleSelect = ( image: UnsplashImage ) => {
    onChange( image.urls.regular );
    fetch( `${ API_URL }/track-download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { downloadLocation: image.links.download_location } ),
    } ).catch( console.error );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-2">
        <Input
          placeholder="Search Unsplash..."
          value={ searchQuery }
          onChange={ ( e ) => {
            setSearchQuery( e.target.value );
            setPage( 1 ); // Reset immediately
            setSearchResults( [] ); // Visual feedback immediately
          } }
          className="h-8"
        />
      </div>

      {/* Change: Removed 'aspect-video' from children.
         Used 'h-28' (fixed height) to force grid rows to open up.
      */ }
      <div className="grid grid-cols-3 gap-2 h-[300px] overflow-y-auto p-3 pt-0 custom-scrollbar content-start">
        { searchResults.map( ( img, index ) => {
          const isLast = index === searchResults.length - 1;
          return (
            <div
              key={ img.id }
              ref={ isLast ? lastImageRef : null }
              className="relative group rounded-md overflow-hidden h-28 w-full cursor-pointer bg-muted"
              onClick={ () => handleSelect( img ) }
            >
              {/* Background Color Placeholder */ }
              <div
                className="absolute inset-0 z-0"
                style={ { backgroundColor: img.color || '#e5e7eb' } }
              />

              <img
                src={ img.urls.small }
                alt={ img.user.name }
                className="relative z-10 w-full h-full object-cover hover:scale-105 transition-transform duration-300 opacity-0 animate-in fade-in duration-500"
                onLoad={ ( e ) => e.currentTarget.classList.remove( 'opacity-0' ) }
              />

              <div
                className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity truncate">
                by <span className="font-medium">{ img.user.name }</span>
              </div>
            </div>
          );
        } ) }

        { isLoading && (
          <div className="col-span-3 flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
          </div>
        ) }

        { !isLoading && searchResults.length === 0 && searchQuery && (
          <div className="col-span-3 text-center text-sm text-muted-foreground py-8">
            No results found.
          </div>
        ) }
      </div>
    </div>
  );
}