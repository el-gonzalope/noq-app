import { useEffect, useState } from 'react';
import { CheckCircle, Clock, Globe } from 'lucide-react';

const TARGET_ARTISTS = [
  { name: "WOS", id: "5YCc6xS5Gpj3EkaYGdjyNK" },
  { name: "Deftones", id: "6Ghvu1VvMGScGpOUJBAHNH" },
  { name: "NCT DREAM", id: "1gBUSTR3TyDdTVFIaQnc02" },
  { name: "Queens of the Stone Age", id: "4pejUc4iciQfgdX6OKulQn" },
  { name: "Red Hot Chili Peppers", id: "0L8ExT028jH3ddEcZwqJJ5" },
  { name: "31 Minutos", id: "1EgVsKobLzbNgILxx9wrVG" }
];

const COUNTRIES = ["Chile", "Argentina", "USA", "Mexico", "Brazil", "Spain"];

interface ArtistAccessListProps {
  token: string;
}

interface MatchedArtist {
  name: string;
  id: string;
  image: string;
  access: "immediate" | "none";
}

export const ArtistAccessList = ({ token }: ArtistAccessListProps) => {
  const [topArtistIDs, setTopArtistIDs] = useState<Set<string>>(new Set());
  const [matchedArtists, setMatchedArtists] = useState<MatchedArtist[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("Chile");

  useEffect(() => {
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

    fetchTopArtists();
  }, [token]);

  useEffect(() => {
    const fetchMatchedArtists = async () => {
      const results: MatchedArtist[] = [];

      for (const { name, id } of TARGET_ARTISTS) {
        try {
          const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();

          results.push({
            name,
            id,
            image: data.images?.[0]?.url || "",
            access: topArtistIDs.has(id) ? "immediate" : "none"
          });
        } catch (err) {
          console.error(`Error fetching artist ${name}`, err);
        }
      }

      setMatchedArtists(results);
    };

    if (topArtistIDs.size > 0) {
      fetchMatchedArtists();
    }
  }, [topArtistIDs, token]);

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
        {matchedArtists.map(({ name, access, image, id }) => (
          <li
            key={id}
            className="bg-white/5 rounded-lg p-4 flex items-center gap-4"
          >
            {image && (
              <img
                src={image}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border border-white/20"
              />
            )}
            <div className="flex-1">
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
