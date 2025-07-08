import { useState, useEffect } from 'react';
import { SpotifyAuth } from '../components/SpotifyAuth';
import { UserProfile } from '../components/UserProfile';
import { Shield, Zap, Users, Globe, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ArtistAccessList } from '../components/ArtistAccessList';


const Index = () => {
  const [user, setUser] = useState<{ display_name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'es'>('es'); // Spanish as default

  const content = {
    en: {
      hero: {
        title: "Fair Tickets for",
        titleAccent: "Real Fans",
        subtitle: "NoQ uses your Spotify listening data to prioritize genuine fans over bots and scalpers in concert ticket queues.",
        cta: "Connect with Spotify"
      },
      features: {
        title: "How NoQ Works",
        items: [
          { icon: Shield, title: "Anti-Bot Protection", description: "Machine learning algorithms analyze listening patterns to distinguish real fans from automated buyers." },
          { icon: Zap, title: "Smart Queue Ranking", description: "Your position is determined by genuine engagement with the artist, not clicking speed or luck." },
          { icon: Users, title: "Fan Priority System", description: "Dedicated listeners get early access, ensuring tickets reach those who truly appreciate the music." }
        ]
      },
      benefits: {
        title: "Why Choose NoQ?",
        items: [
          "Reduce server crashes during high-demand sales",
          "Eliminate random virtual queue systems",
          "Prioritize genuine fans over scalpers",
          "Create fairer ticket distribution",
          "Support artists and their real audience"
        ]
      },
      footer: {
        copyright: "© 2024 NoQ - Fast Queueing. Revolutionizing ticket sales for real fans.",
        website: "www.getnoq.cl"
      }
    },
    es: {
      hero: {
        title: "Entradas Justas para",
        titleAccent: "Fans Reales",
        subtitle: "NoQ utiliza tus datos de Spotify para priorizar a los fans genuinos sobre bots y revendedores en las colas de entradas de conciertos.",
        cta: "Conectar con Spotify"
      },
      features: {
        title: "Cómo Funciona NoQ",
        items: [
          { icon: Shield, title: "Protección Anti-Bot", description: "Algoritmos de aprendizaje automático analizan patrones de escucha para distinguir fans reales de compradores automatizados." },
          { icon: Zap, title: "Clasificación Inteligente de Cola", description: "Tu posición se determina por el compromiso genuino con el artista, no por velocidad de clic o suerte." },
          { icon: Users, title: "Sistema de Prioridad de Fans", description: "Los oyentes dedicados obtienen acceso temprano, asegurando que las entradas lleguen a quienes realmente aprecian la música." }
        ]
      },
      benefits: {
        title: "¿Por Qué Elegir NoQ?",
        items: [
          "Reducir caídas de servidor durante ventas de alta demanda",
          "Eliminar sistemas de cola virtual aleatoria",
          "Priorizar fans genuinos sobre revendedores",
          "Crear distribución más justa de entradas",
          "Apoyar a los artistas y su audiencia real"
        ]
      },
      footer: {
        copyright: "© 2024 NoQ - Fast Queueing. Revolucionando la venta de entradas para fans reales.",
        website: "www.getnoq.cl"
      }
    }
  };

  const t = content[language];

 useEffect(() => {
  if (typeof window !== 'undefined') {
    // First: check query string
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromQuery = urlParams.get('access_token');

    if (tokenFromQuery) {
      localStorage.setItem('spotify_access_token', tokenFromQuery);
      window.history.replaceState({}, document.title, '/'); // clean URL
      fetchUserProfile(tokenFromQuery);
      return;
    }

    // Fallback: check hash (if still used anywhere)
    if (window.location.hash.includes('access_token')) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        localStorage.setItem('spotify_access_token', token);
        window.history.replaceState({}, document.title, '/');
        fetchUserProfile(token);
        return;
      }
    }

    // If already stored
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }
}, []);


  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Failed to fetch user profile');
        localStorage.removeItem('spotify_access_token');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('spotify_access_token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white text-lg">{language === 'en' ? 'Loading...' : 'Cargando...'}</span>
        </div>
      </div>
    );
  }

 if (user) {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <UserProfile user={user} onLogout={handleLogout} />

      <div className="text-center mt-8">
        <Button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">
          Cerrar sesión
        </Button>
      </div>

      const [token, setToken] = useState('');

useEffect(() = {
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) setToken(storedToken);
  }
}, []);
{token && <ArtistAccessList token={token} />}
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex bg-white/10 rounded-full p-1">
          <Button onClick={() => setLanguage('en')} className={`rounded-full px-4 ${language === 'en' ? 'bg-green-500 text-black' : 'text-white hover:bg-white/20'}`}>EN</Button>
          <Button onClick={() => setLanguage('es')} className={`rounded-full px-4 ${language === 'es' ? 'bg-green-500 text-black' : 'text-white hover:bg-white/20'}`}>ES</Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_70%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img src="/images/noq-logo.png" alt="NoQ Logo" className="w-32 h-32 object-contain" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {t.hero.title}
              <span className="text-green-400 block">{t.hero.titleAccent}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">{t.hero.subtitle}</p>
            <div className="mb-16">
              <SpotifyAuth />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">{t.features.title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {t.features.items.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/20 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white/5 rounded-3xl p-8 md:p-12">
          <h2 className="text-4xl font-bold text-white text-center mb-12">{t.benefits.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {t.benefits.items.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-gray-300 text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Globe className="w-5 h-5 text-green-400" />
              <a href="https://www.getnoq.cl" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
                {t.footer.website}
              </a>
            </div>
            <p className="text-gray-500">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
