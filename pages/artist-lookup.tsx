// pages/artist-lookup.tsx

import { useEffect, useState } from 'react';
interface ArtistResult {
  name: string;
  id: string;
  images: { url: string }[];
  genres: string[];
  popularity: number;
  followers: { total: number };
}

const ArtistLookupPage = () => {
  const [token, setToken] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<ArtistResult| null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('spotify_access_token');
    if (stored) setToken(stored);
  }, []);

  const searchArtist = async () => {
    setError('');
    setResult(null);
    if (!token || !searchQuery.trim()) return;

    try {
      const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=artist&limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      interface Artist {
  name: string;
  id: string;
  images: { url: string }[];
  followers: { total: number };
  popularity: number;
  genres: string[];
}

const data: { artists: { items: Artist[] } } = await res.json();
      if (data.artists.items.length === 0) {
        setError('No se encontró ningún artista con ese nombre.');
        return;
      }

      setResult(data.artists.items[0]);
    } catch {
      setError('Error al buscar el artista.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🔎 Búsqueda de Artista en Spotify</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre del artista (ej. Deftones)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 bg-black border border-gray-600 rounded text-white"
        />
        <button
          onClick={searchArtist}
          className="bg-green-500 px-6 py-2 rounded hover:bg-green-600"
        >
          Buscar
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="bg-white/10 p-4 rounded mt-6 space-y-2">
          <p><strong>🎵 Nombre:</strong> {result.name}</p>
          <p><strong>🆔 ID:</strong> {result.id}</p>
          <p><strong>🔥 Popularidad:</strong> {result.popularity}</p>
          <p><strong>🏷️ Géneros:</strong> {result.genres.join(', ') || 'N/A'}</p>
        </div>
      )}
    </div>
  );
};

export default ArtistLookupPage;
