import { useEffect, useState } from 'react';
import { CheckCircle, Clock, Globe } from 'lucide-react';

const TARGET_ARTISTS = [
  "Deftones",
  "NCT Dream",
  "Queens of the Stone Age",
  "Taylor Swift"
];

const COUNTRIES = [
  "Chile", "Argentina", "USA", "Mexico", "Brazil", "Spain"
];

interface ArtistAccessListProps {
  token: string;
}

export const ArtistAccessList = ({ token }: ArtistAccessListProps) => {
  const [topArtistIDs, setTopArtistIDs] = useState<Set<string>>(new Set());
  const [matchedArtists, setMatchedArtists] = useState<{ name: string; id: string; access: "immediate" | "none" }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("Chile");

  useEffect(() => {
    fetchTopArtists();
  }, []);

  useEffect(() => {
    if (topArtistIDs.size > 0) {
      checkUserArtistPresence();
    }
  }, [topArtistIDs]);

  const fetchTopArtists = async () => {
    const res = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      const ids = new Set<string>(data.items.map((artist: { id: string }) => artist.id));
      setTopArtistIDs(ids);
    }
  };

  const checkUserArtistPresence = async () => {
    const results: { name: string; id: string; access: "immediate" | "none" }[] = [];

    for (const artistName of TARGET_ARTISTS) {
      const search = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await search.json();
      const artist = result.artists.items[0];

      if (!artist) continue;

      const access = topArtistIDs.has(artist.id) ? "immediate" : "none";

      results.push({ name: artist.name, id: artist.id, access });
    }

    setMatchedArtists(results);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Globe className="w-6 h-6 text-green-400" /> Tu acceso por artista
      </h2>

      <div className="mb-6">
        <label className="block mb-2 text-sm text-gray-300">Selecciona tu país:</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="bg-black border border-gray-600 text-white p-2 rounded w-full"
        >
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {matchedArtists.map(({ name, access }) => (
          <li
            key={name}
            className="bg-white/5 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold">{name}</p>
              <p className="text-sm text-gray-400">
                {access === "immediate"
                  ? `Tienes acceso inmediato en ${selectedCountry}.`
                  : `No estás entre los principales oyentes en ${selectedCountry}.`}
              </p>
            </div>
            {access === "immediate" ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <Clock className="w-6 h-6 text-gray-400" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
