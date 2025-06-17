import React from 'react';
import { Button } from './ui/button';

type Props = {
  onAuthSuccess: (userData: { display_name: string; email: string }) => void;
};

export const SpotifyAuth: React.FC<Props> = ({ onAuthSuccess }) => {
  const handleLogin = () => {
    const dummyUser = {
      display_name: 'Demo User',
      email: 'demo@example.com',
    };
    localStorage.setItem('spotify_access_token', 'fake_token');
    onAuthSuccess(dummyUser);
  };

  return <Button onClick={handleLogin}>Connect with Spotify</Button>;
};
