import * as React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...rest }) => {
  const className = [
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors',
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
      : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
  ].join(' ');

  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
};

export const ExampleCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm text-slate-600">{description}</p>
  </div>
);
