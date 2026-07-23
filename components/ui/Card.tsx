import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
}: CardProps) {
  const baseClasses =
    'rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)]';
  const hoverClass = hover
    ? 'transition-all duration-150 hover:shadow-[var(--shadow-md)] hover:border-[var(--text-tertiary)]'
    : '';
  const paddingClass = paddingClasses[padding];

  return (
    <div className={`${baseClasses} ${paddingClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}

// CardHeader component
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

// CardTitle component
interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({ children, className = '', as: Component = 'h3' }: CardTitleProps) {
  return (
    <Component className={`text-base font-semibold text-[var(--text-primary)] ${className}`}>
      {children}
    </Component>
  );
}

// CardDescription component
interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return <p className={`text-sm text-[var(--text-secondary)] ${className}`}>{children}</p>;
}

// CardContent component
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`${className}`}>{children}</div>;
}

// CardFooter component
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 border-t border-[var(--border-secondary)] pt-4 ${className}`}>
      {children}
    </div>
  );
}
