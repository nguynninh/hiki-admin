"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import TableComponent from "@/components/forms/TableComponent";
import categoryAPI from "@/apis/categoryAPI";
import CreateCategoryDialog from "@/components/forms/CreateCategoryDialog";
import { useDebounce } from 'use-debounce';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const CategoriesPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Search state
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [debouncedSearch] = useDebounce(search, 500);

    // Pagination state
    const pageParam = searchParams.get('page');
    const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);
    const [limit, setLimit] = useState(10);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        categories: [],
        paginations: {
            page: 1,
            limit: 10,
            total: 0,
            totalPage: 1
        }
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const query = `?page=${page}&limit=${limit}&search=${debouncedSearch}`;
            const res = await categoryAPI.getList(query);
            if (res.data) {
                setData(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit, debouncedSearch]);

    // Update URL when search/page changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (page > 1) params.set('page', page.toString());
        router.push(`/categories?${params.toString()}`);
    }, [debouncedSearch, page]);

    const columns = [
        {
            key: 'image',
            title: t('common:image', { defaultValue: 'Image' }),
            render: (text: string) => text ? <img src={text} alt="cat" className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-200 rounded" />
        },
        {
            key: 'name',
            title: t('category:name', { defaultValue: 'Name' }),
            dataIndex: 'name'
        },
        {
            key: 'slug',
            title: t('category:slug', { defaultValue: 'Slug' }),
            dataIndex: 'slug'
        },
        {
            key: 'parent',
            title: t('category:parent', { defaultValue: 'Parent' }),
            render: (parent: any) => parent ? parent.name : '-'
        }
    ];

    const handleDelete = async (id: string) => {
        if (confirm(t('common:confirm_delete', { defaultValue: "Are you sure?" }))) {
            try {
                await categoryAPI.remove(id);
                toast.success(t('category:deleted', { defaultValue: 'Category deleted' }));
                fetchData();
            } catch (error: any) {
                console.error(error);
                toast.error(error.message || t('common:error_occurred'));
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {t('common:categories', { defaultValue: "Categories" })}
                </h1>
                <CreateCategoryDialog onCategoryCreated={fetchData} />
            </div>

            <TableComponent
                data={data.categories}
                columns={columns}
                api={fetchData}
                renderAction={(item) => (
                    <div className="flex gap-2">
                        <CreateCategoryDialog category={item} onCategoryCreated={fetchData} />
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                            <Trash2 size={16} className="text-red-500" />
                        </Button>
                    </div>
                )}
                pagination={{
                    current: data.paginations.page,
                    pageSize: data.paginations.limit,
                    total: data.paginations.total,
                    onChange: (p, l) => {
                        setPage(p);
                        if (l) setLimit(l);
                    }
                }}
                isLoading={isLoading}
            />
        </div>
    );
};

export default CategoriesPage;
