'use client';

import React, { ReactNode, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-[var(--accent-green)] text-white border border-[var(--accent-green)] hover:bg-[var(--accent-green-hover)]',
  secondary:
    'bg-[var(--accent-blue)] text-white border border-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)]',
  outline:
    'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]',
  ghost:
    'bg-transparent text-[var(--text-secondary)] border border-transparent hover:bg-[var(--bg-secondary)]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      loading = false,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const widthClass = fullWidth ? 'w-full' : '';
    const variantClass = variantClasses[variant];
    const sizeClass = sizeClasses[size];

    const buttonClass = `${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`;

    return (
      <button ref={ref} className={buttonClass} disabled={disabled || loading} {...props}>
        {loading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
        ) : Icon && iconPosition === 'left' ? (
          <Icon className="mr-2 h-4 w-4" />
        ) : null}
        {children}
        {!loading && Icon && iconPosition === 'right' ? (
          <Icon className="ml-2 h-4 w-4" />
        ) : null}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
