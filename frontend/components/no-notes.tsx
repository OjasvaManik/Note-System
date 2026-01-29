import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, } from "@/components/ui/empty"
import { IconNotesOff } from "@tabler/icons-react"
import { Loader2, PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function NoNotes() {
  const router = useRouter();
  const [ loading, setLoading ] = useState( false );
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

  const handleCreate = async () => {
    try {
      setLoading( true );
      const res = await fetch( `${ API_URL }/create-note`, {
        method: 'POST'
      } );

      if ( !res.ok ) throw new Error( 'Failed to create' );

      const data = await res.json();

      // Dispatch event to update sidebar
      window.dispatchEvent( new Event( 'note-updated' ) );

      router.push( `/${ data.id }` );
    } catch ( error ) {
      console.error( error );
    } finally {
      setLoading( false );
    }
  }

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconNotesOff/>
        </EmptyMedia>
        <EmptyTitle>No Note Opened</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t opened any note. Get started by creating
          your first note or clicking on one of the existing ones.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button
          onClick={ handleCreate }
          disabled={ loading }
          className={ 'flex items-center justify-center gap-x-2' }
        >
          { loading ? (
            <>Creating... <Loader2 className="animate-spin w-4 h-4"/></>
          ) : (
            <>Create Note <PlusIcon/></>
          ) }
        </Button>
      </EmptyContent>
    </Empty>
  )
}
