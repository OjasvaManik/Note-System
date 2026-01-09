'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Note } from "@/types/note";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const GetNotes = () => {
  const [ notes, setNotes ] = useState<Note[]>( [] )
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082'

  useEffect( () => {
    fetch( `${ API_URL }` )
      .then( ( res ) => res.json() )
      .then( ( data ) => setNotes( data ) )
      .catch( ( err ) => console.error( 'Failed to load notes:', err ) )
  }, [ API_URL ] )

  const handleDelete = async ( e: React.MouseEvent, id: string ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setNotes( ( prev ) => prev.filter( ( note ) => note.id !== id ) );
      await fetch( `${ API_URL }/${ id }`, { method: 'DELETE' } );
    } catch ( error ) {
      console.error( "Failed to delete", error );
    }
  }

  return (
    <div className="space-y-4">
      { notes.length === 0 && <p className="text-muted-foreground">No notes found.</p> }

      { notes.map( ( note ) => (
        <div key={ note.id } className="group flex items-stretch w-full">

          <Link
            href={ `/${ note.id }` }
            /* CRITICAL FIX: 'min-w-0' enables truncation in flex children.
               Without it, the link expands to fit the full text, pushing the layout.
            */
            className="flex-1 min-w-0 block bg-accent text-accent-foreground p-4 rounded-lg hover:bg-sidebar-accent transition-colors duration-300"
          >
            <div className="flex justify-between items-center gap-3">
              <h2 className="text-xl font-semibold truncate">
                { note.title || 'Untitled Note' }
              </h2>
              <span className="text-xs text-muted-foreground shrink-0">
                { new Date( note.updatedAt ).toLocaleDateString() }
              </span>
            </div>
          </Link>

          {/* Delete Button Wrapper */ }
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
  )
}

export default GetNotes