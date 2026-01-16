export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

export interface UnsplashImage {
  id: string;
  color: string;      // <--- Added for placeholder
  blur_hash: string;  // <--- Added for placeholder
  description: string | null;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    download_location: string; // API usually provides this for tracking
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
}

export const getImageUrl = ( path: string | null ) => {
  if ( !path ) return null;
  if ( path.startsWith( 'http' ) ) return path;
  return `${ API_URL }${ path }`;
};