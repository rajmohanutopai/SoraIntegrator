import React from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'rounded-xl overflow-hidden';
  
  const variantClasses = {
    default: 'bg-luxury-cream shadow-luxury',
    elevated: 'bg-luxury-cream shadow-luxury-lg',
    outlined: 'bg-luxury-cream border border-luxury-silver/30',
    dark: 'bg-luxury-charcoal text-luxury-cream',
    gold: 'bg-gradient-to-br from-luxury-gold/10 to-luxury-gold/5 border border-luxury-gold/20',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <div 
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
};

// Additional components for Card structure
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-b border-luxury-silver/20 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`px-4 py-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-t border-luxury-silver/20 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;