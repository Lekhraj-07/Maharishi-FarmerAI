
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}
export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white rounded-xl shadow-md overflow-hidden p-6 ${className}`}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}
export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 focus:ring-secondary-400',
    ghost: 'bg-transparent text-primary-700 hover:bg-primary-100',
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, ...props }, ref) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={id}
      ref={ref}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      {...props}
    />
  </div>
));

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ label, id, children, ...props }, ref) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      id={id}
      ref={ref}
      className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      {...props}
    >
      {children}
    </select>
  </div>
));

export const Spinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
);
