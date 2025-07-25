import { CountryMedals } from '../pages';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface Props {
  countries: CountryMedals[];
}

const headers = ['gold', 'silver', 'bronze', 'total'] as const;

export default function MedalTable({ countries }: Props) {
  const router = useRouter();
  const currentSort = (router.query.sort as string) || 'gold';

  const handleSortChange = (key: string) => {
    router.push(`/?sort=${key}`);
  };

  const getFlagPosition = (code: string) => {
    const offset = (code.charCodeAt(0) - 65); // 'A' = 65
    return {
      backgroundPosition: `${-offset * 32}px 0`
    };
  };

  return (
    <table style={{ margin: '2rem auto', borderCollapse: 'collapse', width: '80%' }}>
      <thead>
        <tr>
          <th>Country</th>
          {headers.map((key) => (
            <th key={key}>
              <button onClick={() => handleSortChange(key)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentSort === key ? 'bold' : 'normal' }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {countries.map((c) => (
          <tr key={c.code}>
            <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <div
                style={{
                  width: '32px',
                  height: '20px',
                  backgroundImage: 'url(/assets/flags.png)',
                  backgroundSize: '832px 20px',
                  ...getFlagPosition(c.code)
                }}
              />
              {c.code}
            </td>
            <td style={{textAlign: 'center'}}>{c.gold}</td>
            <td style={{textAlign: 'center'}}>{c.silver}</td>
            <td style={{textAlign: 'center'}}>{c.bronze}</td>
            <td style={{textAlign: 'center'}}>{c.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
