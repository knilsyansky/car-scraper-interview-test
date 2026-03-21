import { cn } from '@shared/lib';
import { InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export function Input({
    label,
    error,
    className,
    containerClassName,
    id,
    ...props
}: InputProps) {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-gray-200 select-none"
                >
                    {label}
                </label>
            )}

            <input
                id={inputId}
                className={cn(
                    'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900',
                    'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    'disabled:cursor-not-allowed disabled:opacity-50 transition-all',
                    error && 'border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />

            {error && (
                <p className="text-xs text-red-500 font-medium leading-none">
                    {error}
                </p>
            )}
        </div>
    );
};