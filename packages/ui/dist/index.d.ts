import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
};
declare const Button: React.FC<ButtonProps>;
declare const ExampleCard: React.FC<{
    title: string;
    description: string;
}>;

export { Button, type ButtonProps, ExampleCard };
