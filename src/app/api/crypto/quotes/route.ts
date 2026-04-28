import { NextResponse } from 'next/server';

const IDS = 'bitcoin,ethereum';
const ASSET_META: Record<string, { symbol: string; nameDe: string; nameEn: string }> = {
  bitcoin: { symbol: 'BTC', nameDe: 'Bitcoin', nameEn: 'Bitcoin' },
  ethereum: { symbol: 'ETH', nameDe: 'Ethereum', nameEn: 'Ethereum' }
};

type Vs = 'usd' | 'eur';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawVs = searchParams.get('vs')?.toLowerCase();
  const vs: Vs = rawVs === 'eur' ? 'eur' : 'usd';

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${IDS}&vs_currencies=${vs}&include_24hr_change=true`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ivo-tech/1.0 (marketing site; public price strip)'
      },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'upstream', status: res.status },
        { status: 502, headers: { 'Cache-Control': 's-maxage=30' } }
      );
    }

    const data = (await res.json()) as Record<string, Record<string, number> | undefined>;

    const items = (['bitcoin', 'ethereum'] as const)
      .map((id) => {
        const row = data[id];
        if (!row) return null;
        const price = row[vs];
        const chKey = `${vs}_24h_change` as const;
        const ch = row[chKey];
        if (typeof price !== 'number' || !Number.isFinite(price)) return null;
        const meta = ASSET_META[id];
        return {
          id,
          symbol: meta.symbol,
          nameDe: meta.nameDe,
          nameEn: meta.nameEn,
          price,
          change24hPct: typeof ch === 'number' && Number.isFinite(ch) ? ch : null
        };
      })
      .filter((x): x is NonNullable<typeof x> => x != null);

    if (items.length === 0) {
      return NextResponse.json({ error: 'empty' }, { status: 502, headers: { 'Cache-Control': 's-maxage=30' } });
    }

    return NextResponse.json(
      {
        vs,
        items,
        fetchedAt: new Date().toISOString()
      },
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } }
    );
  } catch {
    return NextResponse.json(
      { error: 'network' },
      { status: 502, headers: { 'Cache-Control': 's-maxage=20' } }
    );
  }
}
