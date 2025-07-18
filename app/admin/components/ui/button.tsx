'use client';

import React from 'react';
import { cn } from "../../../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs';
}

// Утилита для получения классов варианта
const getVariantClasses = (variant: ButtonProps['variant'] = 'default') => {
  const variants = {
    default: 'bg-violet-600 text-white hover:bg-violet-700 border-transparent shadow-sm',
    destructive: 'bg-red-600 text-white hover:bg-red-700 border-transparent shadow-sm',
    outline: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-400',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 border-transparent',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent',
    link: 'text-violet-600 underline-offset-4 hover:underline border-transparent p-0 h-auto',
    success: 'bg-green-600 text-white hover:bg-green-700 border-transparent shadow-sm',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 border-transparent shadow-sm',
  };
  
  return variants[variant];
};

// Утилита для получения классов размера
const getSizeClasses = (size: ButtonProps['size'] = 'default') => {
  const sizes = {
    xs: 'h-7 px-2 text-xs',
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2 text-sm',
    lg: 'h-11 px-6 text-base',
    icon: 'h-10 w-10 p-0',
  };
  
  return sizes[size];
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    
    const buttonClasses = cn(
      'inline-flex items-center justify-center rounded-lg font-medium border',
      'transition-all duration-200 focus-visible:outline-none',
      'focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'active:scale-95',
      variantClasses,
      sizeClasses,
      className
    );
    
    return (
      <button
        className={buttonClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
)

Button.displayName = "Button";

// Сохраняем функцию buttonVariants для обратной совместимости
const buttonVariants = ({ variant, size, className }: { 
  variant?: ButtonProps['variant'],
  size?: ButtonProps['size'],
  className?: string 
}) => {
  return cn(
    'inline-flex items-center justify-center rounded-lg font-medium border',
    'transition-all duration-200 focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-95',
    getVariantClasses(variant),
    getSizeClasses(size),
    className
  );
};

export { Button, buttonVariants }; 