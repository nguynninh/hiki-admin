import { useEffect, useState, useMemo } from "react";
import axiosClient from "@/apis/axiosClient";
import type { Pagination } from "@/models/Pagination";
import { useSelector } from "react-redux";

const useFetchList = <T>(
    path: string,
    query: Record<string, string>,
    config: object = {}
): [T[], Pagination] => {
    const auth = useSelector((state: any) => state.authReducer.data);
    const [data, setData] = useState<T[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        previousPage: false,
        nextPage: false,
        totalItems: 0,
        totalPages: 0,
    });

    const queryString = useMemo(() => JSON.stringify(query), [query]);
    const configString = useMemo(() => JSON.stringify(config), [config]);

    useEffect(() => {
        const fetchData = async () => {
            const parsedQuery = JSON.parse(queryString);
            const queryWithSkip = {
                ...parsedQuery,
                page: Number(parsedQuery.page) - 1 || 0,
                skip: Number(parsedQuery.page) * Number(parsedQuery.limit) - Number(parsedQuery.limit),
            };

            const queryParams = new URLSearchParams(
                Object.entries(queryWithSkip).reduce((acc, [key, value]) => {
                    acc[key] = String(value);
                    return acc;
                }, {} as Record<string, string>)
            ).toString();

            try {
                const lastPath = path.split('/').pop() || 'items';
                const parsedConfig = JSON.parse(configString);
                const response = await axiosClient.get(`${path}/search?${queryParams}`, {
                    ...parsedConfig,
                    headers: {
                        "Authorization": `Bearer ${auth?.access_token}`,
                    }
                });

                if (response && response.data && response.data[lastPath]) {
                    setData(response.data[lastPath]);
                    const updatedPagination = {
                        limit: Number(parsedQuery.limit) || 10,
                        totalItems: 0,
                        totalPages: 0,
                        previousPage: false,
                        nextPage: false,
                        ...response.data.pagination,
                        page: Number(parsedQuery.page) || 1
                    };
                    setPagination(updatedPagination);
                } else
                    setData([]);
            } catch {
                setData([]);
            }
        };

        fetchData();
    }, [path, queryString, configString, auth?.access_token]);

    return [data, pagination];
}

export default useFetchList;