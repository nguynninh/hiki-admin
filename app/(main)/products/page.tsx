"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TableComponent from "@/components/forms/TableComponent";
import productAPI from "@/apis/productAPI";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus as Add } from "lucide-react";
import { Pagination } from "@/models/Pagination";

const ProductsPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [refreshKey, setRefreshKey] = useState(0);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
        nextPage: false,
        previousPage: false
    });
    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
    });

    const columns: any[] = [
        {
            key: "image",
            title: t("common:image", { defaultValue: "Image" }),
            render: (item: any) => {
                const img = item.image_url || item.variants?.[0]?.image_url;
                return img ? (
                    <img src={img} alt={item.name} className="w-10 h-10 object-cover rounded" />
                ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                );
            }
        },
        {
            key: "name",
            title: t("product:name", { defaultValue: "Name" }),
            sortable: true,
        },
        {
            key: "brand",
            title: t("product:brand", { defaultValue: "Brand" }),
            sortable: true,
        },
        {
            key: "category.name",
            title: t("product:category", { defaultValue: "Category" }),
            render: (item: any) => item.category?.name || 'N/A'
        },
        {
            key: "price",
            title: t("product:price", { defaultValue: "Price" }),
            render: (item: any) => {
                const price = item.variants?.[0]?.price;
                return price ? `$${price}` : 'N/A';
            }
        },
        {
            key: "seller.name",
            title: t("product:seller", { defaultValue: "Seller" }),
            render: (item: any) => item.seller?.lastname + ' ' + item.seller?.firstname || 'N/A'
        },
        {
            key: "actions",
            title: t("common:actions", { defaultValue: "Actions" }),
            render: (item: any) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/products/${item.id}`)}
                    >
                        <Edit size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            ),
        }
    ];

    useEffect(() => {
        fetchData();
    }, [query, refreshKey]);

    const fetchData = async () => {
        try {
            const params: any = { ...query };
            const queryString = new URLSearchParams(params).toString();

            const res = await productAPI.getList(`?${queryString}`);
            if (res.data && res.data.products) {
                setData(res.data.products);
                setPagination({
                    page: res.data.paginations.page,
                    limit: res.data.paginations.limit,
                    totalItems: res.data.paginations.total || 0,
                    totalPages: res.data.paginations.totalPages || 1,
                    nextPage: res.data.paginations.nextPage,
                    previousPage: res.data.paginations.previousPage
                });
            }
        } catch (error) {
            console.error(error);
            toast.error(t('common:error_fetching_data', { defaultValue: 'Error fetching data' }));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('common:confirm_delete'))) return;
        try {
            await productAPI.remove(id);
            toast.success(t('common:deleted_success'));
            setRefreshKey(prev => prev + 1);
        } catch (error: any) {
            toast.error(error.message || t('common:error_occurred'));
        }
    }

    const updateQuery = (newQuery: any) => {
        setQuery(prev => ({ ...prev, ...newQuery }));
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {t('common:products', { defaultValue: "Products" })}
                </h1>
                <Button onClick={() => router.push('/products/create')}>
                    <Add size={20} className="mr-2" />
                    {t('product:create_new', { defaultValue: "Create New" })}
                </Button>
            </div>
            <TableComponent
                data={data}
                columns={columns}
                pagination={pagination}
                updateQuery={updateQuery}
                isRefresh
            />
        </div>
    );
};

export default ProductsPage;
