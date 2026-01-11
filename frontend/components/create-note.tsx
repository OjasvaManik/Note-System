'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader2, PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const CreateNote = () => {
  const pathname = usePathname();
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
      router.push( `/${ data.id }` );
    } catch ( error ) {
      console.error( error );
    } finally {
      setLoading( false );
    }
  }

  return (
    <div className={ 'flex justify-end py-2 space-x-2' }>
      { pathname !== '/' && (
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link href="/">
            <ArrowLeftIcon/>
          </Link>
        </Button>
      ) }

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
    </div>
  )
}
export default CreateNote