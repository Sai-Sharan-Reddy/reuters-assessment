import { useEffect, useState, useMemo } from 'react';
import MedalTable from '../components/MedalTable';
import { useRouter } from 'next/router';

export interface CountryMedals {
  code: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export default function Home() {
  const router = useRouter();
  const { sort = 'gold' } = router.query;
  const sortKey = typeof sort === 'string' ? sort : 'gold';

  const [rawData, setRawData] = useState<CountryMedals[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/medals.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch medal data');
        return res.json();
      })
      .then((medals: Omit<CountryMedals, 'total'>[]) => {
        const enriched = medals.map(entry => ({
          ...entry,
          total: entry.gold + entry.silver + entry.bronze
        }));
        setRawData(enriched);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load medal data.');
      });
  }, []);

  const sortedData = useMemo(() => {
    const sorted = [...rawData].sort((a, b) => {
      const primary = b[sortKey as keyof CountryMedals] - a[sortKey as keyof CountryMedals];
      if (primary !== 0) return primary;

      if (sortKey === 'total') return b.gold - a.gold;
      if (sortKey === 'gold') return b.silver - a.silver;
      return b.gold - a.gold;
    });
    return sorted.slice(0, 10);
  }, [rawData, sortKey]);

  return (
    <main>
      <h1>Olympic Medal Count</h1>
      {error ? <p style={{ color: 'red' }}>{error}</p> : <MedalTable countries={sortedData} />}
    </main>
  );
}
