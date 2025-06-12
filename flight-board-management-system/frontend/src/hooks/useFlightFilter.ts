import { useState, useCallback } from 'react';
import { FlightFilter } from '../models/Flight';

export const useFlightFilter = (onFilter: (filter: FlightFilter) => void) => {
    const [filter, setFilter] = useState<FlightFilter>({});

    const handleFilterChange = useCallback((key: keyof FlightFilter, value: string) => {
        setFilter(prev => ({
            ...prev,
            [key]: value || undefined
        }));
    }, []);

    const handleSearch = useCallback(() => {
        onFilter(filter);
    }, [filter, onFilter]);

    const clearFilters = useCallback(() => {
        setFilter({});
        onFilter({});
    }, [onFilter]);

    return {
        filter,
        handleFilterChange,
        handleSearch,
        clearFilters
    };
};