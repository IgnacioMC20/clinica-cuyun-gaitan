import React, { useState, useEffect } from 'react';
import { Input } from '../atoms/Input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    debounceMs?: number;
    className?: string;
    disabled?: boolean;
    initialValue?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    onSearch,
    placeholder = 'Buscar...',
    debounceMs = 300,
    className,
    disabled = false,
    initialValue = ''
}) => {
    const [query, setQuery] = useState(initialValue);

    // Sync internal state with initialValue changes
    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, onSearch, debounceMs]);

    const searchIcon = (
        <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    );

    return (
        <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            leftIcon={searchIcon}
            disabled={disabled}
            className={cn('pr-10', className)}
        />
    );
};

export default SearchInput;