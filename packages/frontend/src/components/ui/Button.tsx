import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'default' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group';
  
  const variants = {
    default: 'bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-500 hover:to-lime-500 text-black shadow-lg hover:shadow-xl hover:scale-105',
    outline: 'glass border-2 border-green-500/30 text-white hover:bg-green-500/10 hover:border-green-500/50 hover:scale-105',
    ghost: 'text-white hover:bg-green-500/10 hover:scale-105',
    gradient: 'bg-gradient-to-r from-green-600 via-lime-600 to-green-500 hover:from-green-500 hover:via-lime-500 hover:to-green-400 text-black shadow-glow-green hover:shadow-glow-green hover:scale-105'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    default: 'px-5 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
    xl: 'px-10 py-5 text-lg rounded-2xl'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* Shimmer effect */}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
