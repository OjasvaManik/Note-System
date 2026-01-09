import { Ballet, Bebas_Neue, JetBrains_Mono, Righteous } from "next/font/google";

export const bebasNeue = Bebas_Neue( {
  subsets: [ 'latin' ],
  weight: [ '400' ],
  fallback: [ 'mono' ]
} );

export const jetBrainsMono = JetBrains_Mono( {
  subsets: [ 'latin' ],
  weight: [ '400', '700', '800' ],
  fallback: [ 'mono' ]
} );

export const ballet = Ballet( {
  subsets: [ 'latin' ],
  weight: [ '400' ],
  fallback: [ 'mono' ]
} );

export const righteous = Righteous( {
  subsets: [ "latin" ],
  weight: "400",
  variable: "--font-righteous",
} );