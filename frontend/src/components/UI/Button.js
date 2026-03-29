import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none transition-all duration-200 rounded';
  
  const variantClasses = {
    primary: 'bg-luxury-gold text-luxury-charcoal hover:bg-opacity-90',
    secondary: 'bg-luxury-silver text-luxury-charcoal hover:bg-opacity-90',
    outline: 'border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:bg-opacity-10',
    dark: 'bg-luxury-charcoal text-luxury-cream hover:bg-opacity-90',
    light: 'bg-luxury-cream text-luxury-charcoal hover:bg-opacity-90',
    danger: 'bg-luxury-burgundy text-luxury-cream hover:bg-opacity-90',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5 rounded',
    md: 'text-base px-4 py-2 rounded-lg',
    lg: 'text-lg px-6 py-3 rounded-xl',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button 
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;