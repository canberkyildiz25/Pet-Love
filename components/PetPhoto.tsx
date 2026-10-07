import { PawPrint } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import type { Photo } from '@/lib/types';

/** A notice's photograph, cropped around the animal's face. A sample's is a
    file the site ships and is resized on the way; one a visitor added is kept
    as it was made, already small. A notice without one says so with a mark. */
export function PetPhoto({ photo, alt, sizes, lead = false }: { photo: Photo | null; alt: string; sizes: string; lead?: boolean }) {
  if (!photo) {
    return (
      <span className="nophoto" role="img" aria-label={alt ? `${alt}: no photograph` : 'No photograph'}>
        <PawPrint size={40} weight="fill" aria-hidden="true" />
      </span>
    );
  }
  const position = { objectPosition: `${photo.fx}% ${photo.fy}%` };
  if (photo.src.startsWith('data:')) {
    // eslint-disable-next-line @next/next/no-img-element -- a photograph kept in the browser has no address to resize from
    return <img src={photo.src} alt={alt} width={photo.w} height={photo.h} style={position} loading={lead ? 'eager' : 'lazy'} decoding="async" />;
  }
  return <Image src={photo.src} alt={alt} width={photo.w} height={photo.h} sizes={sizes} quality={80} preload={lead} loading={lead ? 'eager' : 'lazy'} style={position} />;
}
