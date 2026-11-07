import { NextResponse, type NextRequest } from 'next/server';

const ALLOWED_URL_PATTERN =
  /^https:\/\/github\.com\/OronCanopy\/OronBox\/releases\/download\/[^/]+\/sha256sums\.txt$/;

const MIRRORS = [
  (url: string) => url,
  (url: string) => `https://ghfast.top/${url}`,
  (url: string) => `https://mirror.ghproxy.com/${url}`,
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url || !ALLOWED_URL_PATTERN.test(url)) {
    return NextResponse.json(
      { error: 'Invalid checksums URL' },
      { status: 400 },
    );
  }

  for (const wrap of MIRRORS) {
    try {
      const res = await fetch(wrap(url), {
        redirect: 'follow',
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (text.trim().length > 0) {
        return new NextResponse(text, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        });
      }
    } catch {
      /* try next mirror */
    }
  }

  return NextResponse.json(
    { error: 'Failed to fetch checksums' },
    { status: 502 },
  );
}
