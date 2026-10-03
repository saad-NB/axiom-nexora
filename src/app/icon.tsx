import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/**
 * Raster tab icon, served at /icon. The SVG in public/ is the primary
 * favicon, but some browsers and crawlers still prefer a PNG at 32x32.
 * Same mark as favicon.svg and apple-icon.tsx: orange square, paper cross.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FF4D00',
          color: '#F4F3EF',
          fontSize: 23,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        +
      </div>
    ),
    size,
  );
}
