export interface Pagination {
    page: number;
    limit: number;
    previousPage: boolean;
    nextPage: boolean;
    totalItems: number;
    totalPages: number;
}