export type CryptoQuoteItem = {
  id: 'bitcoin' | 'ethereum';
  symbol: string;
  nameDe: string;
  nameEn: string;
  price: number;
  change24hPct: number | null;
};

export type CryptoQuotesResponse = {
  vs: 'usd' | 'eur';
  items: CryptoQuoteItem[];
  fetchedAt: string;
};
