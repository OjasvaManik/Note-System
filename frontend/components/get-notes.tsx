'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Note } from "@/types/note";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import CreateNote from "@/components/create-note";


const GetNotes = () => {
  const [ notes, setNotes ] = useState<Note[]>( [] )
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082'
  const params = useParams();
  const router = useRouter();

  const getImageUrl = ( path: string | null ) => {
    if ( !path ) return null;
    if ( path.startsWith( 'http' ) ) return path;
    return `${ API_URL }${ path }`;
  }

  const fetchNotes = useCallback( () => {
    fetch( `${ API_URL }` )
      .then( ( res ) => {
        if ( !res.ok ) throw new Error( `HTTP Error: ${ res.status }` );
        return res.json();
      } )
      .then( ( data ) => {
        if ( Array.isArray( data ) ) {
          setNotes( data );
        } else {
          console.error( "API returned invalid data:", data );
          setNotes( [] );
        }
      } )
      .catch( ( err ) => console.error( 'Failed to load notes:', err ) )
  }, [ API_URL ] );

  useEffect( () => {
    fetchNotes();

    window.addEventListener( 'note-updated', fetchNotes );
    return () => {
      window.removeEventListener( 'note-updated', fetchNotes );
    }
  }, [ fetchNotes ] )

  const handleDelete = async ( e: React.MouseEvent, id: string ) => {
    e.preventDefault();
    e.stopPropagation();

    setNotes( ( prev ) => prev.filter( ( note ) => note.id !== id ) );

    if ( params?.id === id ) {
      router.push( '/' );
    }

    try {
      await fetch( `${ API_URL }/${ id }`, { method: 'DELETE' } );
      window.dispatchEvent( new Event( 'note-updated' ) );
    } catch ( error ) {
      console.error( "Failed to delete", error );
    }
  }

  return (
    <div className="flex flex-col h-full">

      <div className="shrink-0 pb-4">
        <CreateNote/>
      </div>

      {/* FIXED: Single line string to prevent hydration mismatch */ }
      <div
        className="flex-1 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        { notes.length === 0 && <p className="text-muted-foreground">No notes found.</p> }

        { Array.isArray( notes ) && notes.map( ( note, index ) => (
          <div key={ note.id } className="group flex items-stretch w-full justify-center">
            <span className="text-lg text-center w-12 opacity-30">
              { String( index + 1 ).padStart( 2, '0' ) }
            </span>
            <Link
              href={ `/${ note.id }` }
              className="
                relative flex-1 min-w-0 block
                bg-accent text-accent-foreground
                p-4 rounded-lg
                hover:bg-sidebar-accent hover:dark:bg-transparent
                transition-colors duration-300
                overflow-hidden
              "
            >
              { note.bannerUrl && (
                <img
                  src={ getImageUrl( note.bannerUrl )! }
                  alt=""
                  className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-50 z-0 pointer-events-none"
                  style={ {
                    maskImage: 'linear-gradient(to right, transparent, black)'
                  } }
                />
              ) }

              <div className="relative z-10 flex justify-between items-center gap-3">
                <h2 className="text-xl font-semibold truncate">
                  { note.emoji && <span className="mr-2">{ note.emoji }</span> }
                  { note.title || 'Untitled Note' }
                </h2>
                <span
                  className="text-xs text-muted-foreground shrink-0 backdrop-blur-sm bg-background/20 px-2 py-1 rounded-md">
                  { new Date( note.updatedAt ).toLocaleDateString() }
                </span>
              </div>
            </Link>

            <div
              className="
                grid grid-rows-[1fr] overflow-hidden transition-all duration-300 ease-in-out
                w-16 opacity-100 ml-2
                md:w-0 md:opacity-0 md:ml-0
                md:group-hover:w-16 md:group-hover:opacity-100 md:group-hover:ml-2
              "
            >
              <Button
                onClick={ ( e ) => handleDelete( e, note.id ) }
                className="
                  w-full h-auto rounded-lg
                  bg-destructive text-destructive-foreground
                  hover:bg-destructive/90
                  flex items-center justify-center
                "
              >
                <Trash2 size={ 20 }/>
              </Button>
            </div>
          </div>
        ) ) }
      </div>
    </div>
  )
}

export default GetNotes