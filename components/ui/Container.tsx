import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-5xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-4',
  md: 'px-4 md:px-6',
  lg: 'px-4 md:px-8 lg:px-12',
};

export default function Container({
  children,
  className = '',
  size = 'xl',
  padding = 'md',
}: ContainerProps) {
  const sizeClass = sizeClasses[size];
  const paddingClass = paddingClasses[padding];
  const baseClasses = 'mx-auto w-full';

  return (
    <div className={`${baseClasses} ${sizeClass} ${paddingClass} ${className}`}>{children}</div>
  );
}

// Section Container with optional background
interface SectionContainerProps extends ContainerProps {
  background?: 'white' | 'gray' | 'transparent';
  fullWidth?: boolean;
}

export function SectionContainer({
  children,
  className = '',
  size = 'xl',
  padding = 'md',
  background = 'white',
  fullWidth = false,
}: SectionContainerProps) {
  const backgroundClasses = {
    white: 'bg-[var(--bg-primary)]',
    gray: 'bg-[var(--bg-secondary)]',
    transparent: 'bg-transparent',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const backgroundClass = backgroundClasses[background];
  const containerSize = fullWidth ? 'full' : size;

  return (
    <section className={`${backgroundClass} ${widthClass} ${className}`}>
      <Container size={containerSize} padding={padding}>
        {children}
      </Container>
    </section>
  );
}
