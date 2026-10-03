import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Apple touch icon: the same orange square and paper cross as the favicon. */
export default function AppleIcon() {
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
          fontSize: 130,
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
