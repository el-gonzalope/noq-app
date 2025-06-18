import React from 'react';
import { Button } from './ui/button';

export const SpotifyAuth: React.FC = () => {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <Button onClick={handleLogin}>
      Connect with Spotify
    </Button>
  );
};
