// components/ui/button.tsx
import React from 'react';

export const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
