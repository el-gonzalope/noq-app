import React from 'react';
import { Button } from './ui/button';

type Props = {
  user: any;
  onLogout: () => void;
};

export const UserProfile: React.FC<Props> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center space-y-6">
      <h1 className="text-4xl font-bold">Welcome, {user.display_name}</h1>
      <p className="text-gray-400">Email: {user.email}</p>
      <Button onClick={onLogout} className="mt-4 bg-red-500 hover:bg-red-600">
        Log out
      </Button>
    </div>
  );
};
