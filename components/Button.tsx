import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variantStyles = '';
  let sizeStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-primary hover:bg-blue-700 text-white focus:ring-primary';
      break;
    case 'secondary':
      variantStyles = 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500';
      break;
    case 'outline':
      variantStyles = 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white';
      break;
    case 'ghost':
      variantStyles = 'text-primary hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 focus:ring-primary';
      break;
  }

  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1 text-sm';
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-base';
      break;
    case 'lg':
      sizeStyles = 'px-5 py-3 text-lg';
      break;
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;