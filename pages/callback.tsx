import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');

        if (token) {
          localStorage.setItem('spotify_access_token', token);
          router.push('/');
        }
      } else if (hash.includes('error')) {
        console.error('Spotify returned an error:', hash);
        router.push('/?auth_error=true');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p>Conectando con Spotify...</p>
    </div>
  );
};

export default Callback;
