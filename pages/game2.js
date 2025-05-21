import dynamic from 'next/dynamic';
const CryptoRunner = dynamic(() => import('../components/CryptoRunner'), { ssr: false });

export default function Game2Page() {
  return <CryptoRunner />;
}

