'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VRPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/hyperdimensional');
  }, [router]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ fontSize: '24px' }}> VERA</div>
      <div>Redirecting to main experience...</div>
    </div>
  );
}
