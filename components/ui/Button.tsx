"use client";

import { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  isLoading?: boolean;
  style?: CSSProperties;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  children,
  style = {},
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 200ms ease',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.5 : 1,
    border: 'none',
    fontWeight: '600',
    ...style
  };

  const variantStyle: React.CSSProperties = 
    variant === 'primary'
      ? {
          backgroundColor: '#06b6d4',
          color: '#000',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
        }
      : variant === 'secondary'
      ? {
          backgroundColor: 'rgba(31, 41, 55, 1)',
          color: '#fff'
        }
      : variant === 'outline'
      ? {
          border: '1px solid rgba(55, 65, 81, 1)',
          color: '#fff',
          backgroundColor: 'transparent'
        }
      : {
          color: 'rgba(107, 114, 128, 1)',
          backgroundColor: 'transparent'
        };

  const sizeStyle: React.CSSProperties =
    size === 'sm'
      ? { padding: '6px 12px', fontSize: '14px', borderRadius: '6px' }
      : size === 'lg'
      ? { padding: '12px 24px', fontSize: '16px', borderRadius: '8px' }
      : { padding: '8px 16px', fontSize: '15px', borderRadius: '6px' };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        ...baseStyle,
        ...variantStyle,
        ...sizeStyle
      }}
      {...props}
    >
      {isLoading && (
        <span style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      )}
      {children}
    </button>
  );
}
