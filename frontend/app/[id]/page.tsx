'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import MyEditor from "@/components/my-editor";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { debounce } from "lodash";
import { PartialBlock } from "@blocknote/core";
import CreateNote from "@/components/create-note"; // 1. Import Type

const NotePage = () => {
  const params = useParams();
  const id = params.id as string;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

  const [ isLoading, setIsLoading ] = useState( true );
  const [ title, setTitle ] = useState( '' );
  // 2. State is strictly typed now
  const [ initialContent, setInitialContent ] = useState<PartialBlock[] | undefined>( undefined );

  useEffect( () => {
    const fetchNote = async () => {
      try {
        const res = await fetch( `${ API_URL }/${ id }` );
        if ( !res.ok ) throw new Error( "Note not found" );
        const data = await res.json();

        setTitle( data.title || '' );

        // 3. Check if content exists and cast it
        if ( data.content && Array.isArray( data.content ) && data.content.length > 0 ) {
          setInitialContent( data.content as PartialBlock[] );
        } else {
          setInitialContent( undefined );
        }
      } catch ( error ) {
        console.error( error );
      } finally {
        setIsLoading( false );
      }
    };

    if ( id ) fetchNote();
  }, [ id, API_URL ] );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveTitle = useCallback(
    debounce( async ( newTitle: string ) => {
      await fetch( `${ API_URL }/${ id }`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { title: newTitle } ),
      } );
    }, 1000 ),
    [ id, API_URL ]
  );

  const handleTitleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const val = e.target.value;
    setTitle( val );
    saveTitle( val );
  }

  if ( isLoading ) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin"/>
      </div>
    );
  }

  return (
    <div>
      <CreateNote/>
      <div className="flex flex-col space-y-4">
        <Input
          type='text'
          value={ title }
          onChange={ handleTitleChange }
          placeholder='Untitled'
          className="h-20 text-5xl lg:text-5xl font-semibold"
        />
        <div className="-ml-4">
          <MyEditor initialContent={ initialContent } id={ id }/>
        </div>
      </div>
    </div>
  )
}
export default NotePage