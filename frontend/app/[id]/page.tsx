'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import MyEditor from "@/components/my-editor";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { debounce } from "lodash";
import { PartialBlock } from "@blocknote/core";
import CreateNote from "@/components/create-note";
import EmojiPickerComponent from "@/components/emoji-picker-component";
import BannerComponent from "@/components/banner-component";
import { EmojiMartEmoji } from "@/types/types";
import { Note } from "@/types/note";

const NotePage = () => {
  const params = useParams();
  const id = params.id as string;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

  const [ isLoading, setIsLoading ] = useState( true );
  const [ title, setTitle ] = useState( '' );
  const [ emoji, setEmoji ] = useState<string | null>( null );
  const [ bannerUrl, setBannerUrl ] = useState<string | null>( null );
  const [ initialContent, setInitialContent ] = useState<PartialBlock[] | undefined>( undefined );

  useEffect( () => {
    const fetchNote = async () => {
      try {
        const res = await fetch( `${ API_URL }/${ id }` );
        if ( !res.ok ) throw new Error( "Note not found" );

        const data = await res.json() as Note;

        setTitle( data.title || '' );
        setEmoji( data.emoji || null );
        setBannerUrl( data.bannerUrl || null );

        if ( data.content ) {
          if ( Array.isArray( data.content ) && data.content.length > 0 ) {
            setInitialContent( data.content as unknown as PartialBlock[] );
          } else if ( typeof data.content === 'string' ) {
            try {
              const parsed = JSON.parse( data.content );
              if ( Array.isArray( parsed ) && parsed.length > 0 ) {
                setInitialContent( parsed as PartialBlock[] );
              }
            } catch ( e ) {
              console.error( "Failed to parse content", e );
            }
          }
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

  const saveField = useCallback(
    debounce( async ( field: keyof Note, value: string | null ) => {
      await fetch( `${ API_URL }/${ id }`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { [ field ]: value } ),
      } );
    }, 1000 ),
    [ id, API_URL ]
  );

  const saveFieldImmediate = async ( field: keyof Note, value: string | null ) => {
    await fetch( `${ API_URL }/${ id }`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( { [ field ]: value } ),
    } );
  }

  const handleTitleChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    const val = e.target.value;
    setTitle( val );
    saveField( 'title', val );
  }

  const handleEmojiSelect = ( selected: EmojiMartEmoji ) => {
    setEmoji( selected.native );
    saveFieldImmediate( 'emoji', selected.native );
  }

  const handleBannerChange = ( url: string | null ) => {
    setBannerUrl( url );
    saveFieldImmediate( 'bannerUrl', url );
  }

  if ( isLoading ) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin"/>
      </div>
    );
  }

  return (
    <div className="h-full w-full">

      <div className="max-w-4xl mx-auto">
        <CreateNote/>
        <BannerComponent url={ bannerUrl } onChange={ handleBannerChange }/>

        <div className="flex flex-col">
          <div className={ 'flex items-center gap-x-1' }>
            <EmojiPickerComponent
              currentEmoji={ emoji }
              onSelect={ handleEmojiSelect }
            />
            <Input
              type='text'
              value={ title }
              onChange={ handleTitleChange }
              placeholder='Untitled'
              className="h-20 text-5xl lg:text-5xl font-bold border-0 bg-transparent dark:bg-transparent shadow-none"
            />
          </div>

          <div className="-ml-4">
            <MyEditor initialContent={ initialContent } id={ id }/>
          </div>
        </div>
      </div>
    </div>
  )
}
export default NotePage