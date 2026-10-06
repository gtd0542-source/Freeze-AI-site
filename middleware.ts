// Language of frezzai.app by country (Vercel Routing Middleware: runs before the home page is served).
// English is the default. The home page "/" sends visitors from French-speaking countries to "/fr/", unless they chose
// a language with the FR / EN switch (cookie "frezz-lang", set by lang.js), which always wins. Every other address is
// served as asked, so a shared link keeps its language. Search engines are never redirected (hreflang tells them).

const FRENCH_COUNTRIES = new Set([
  // Europe
  'FR', 'BE', 'CH', 'LU', 'MC',
  // French overseas territories
  'GP', 'MQ', 'GF', 'RE', 'YT', 'PM', 'BL', 'MF', 'WF', 'PF', 'NC',
  // French-speaking Africa, Haiti
  'CM', 'SN', 'CI', 'BJ', 'BF', 'ML', 'NE', 'TG', 'GN', 'CD', 'CG', 'GA', 'CF', 'TD', 'MG', 'DJ', 'KM', 'BI', 'MR', 'MA', 'DZ', 'TN', 'HT',
]);
const BOT = /bot|crawler|spider|slurp|facebookexternalhit|embedly|preview/i;

export const config = { matcher: ['/'] };

/** Same as next() from @vercel/functions: let the request reach the static page (no dependency needed). */
const next = () => new Response(null, { headers: { 'x-middleware-next': '1' } });

export default function middleware(request: Request) {
  const chosen = (request.headers.get('cookie') || '').match(/(?:^|;\s*)frezz-lang=(fr|en)\b/);
  let french: boolean;
  if (chosen) {
    french = chosen[1] === 'fr';
  } else {
    if (BOT.test(request.headers.get('user-agent') || '')) return next();
    const country = request.headers.get('x-vercel-ip-country') || '';
    const region = request.headers.get('x-vercel-ip-country-region') || '';
    french = FRENCH_COUNTRIES.has(country) || (country === 'CA' && region === 'QC');
  }
  if (!french) return next();
  return new Response(null, {
    status: 307,
    headers: { Location: new URL('/fr/', request.url).toString(), 'Cache-Control': 'private, no-store', Vary: 'Cookie' },
  });
}
