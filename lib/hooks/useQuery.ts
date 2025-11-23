import { useState } from "react";

interface Query {
    q?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';

    [key: string]: any;
}

const useQuery = (initial: Query) => {
    const [query, setQuery] = useState<Query>(initial);

    const updateQuery = (newQuery: Partial<Query>) => {
        setQuery((prev) => ({
            ...prev,
            ...newQuery,
        }));
    };

    const resetQuery = () => {
        setQuery(initial);
    };

    return [query, updateQuery, resetQuery] as const;
};

export default useQuery;