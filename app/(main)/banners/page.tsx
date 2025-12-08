"use client";

import bannerAPI from "@/apis/bannerAPI";
import TableComponent, { FilterConfig } from "@/components/forms/TableComponent";
import { Pagination as PaginationModel } from "@/models/Pagination";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const BannersPage = () => {
    const { t } = useTranslation();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [pagination, setPagination] = useState<PaginationModel>({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
        previousPage: false,
        nextPage: false
    });
    const [query, setQuery] = useState({
        page: 1,
        limit: 10,
        q: "",
        is_active: "all",
    });

    // For Delete Dialog
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const columns = [
        {
            key: "image_url",
            title: t("banner:image", { defaultValue: "Image" }),
            type: "image",
        },
        {
            key: "title",
            title: t("banner:title", { defaultValue: "Title" }),
        },
        {
            key: "priority",
            title: t("banner:priority", { defaultValue: "Priority" }),
        },
        {
            key: "is_active",
            title: t("banner:status", { defaultValue: "Status" }),
            render: (item: any) => (
                <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                    {item.is_active ? t('common:active', { defaultValue: 'Active' }) : t('common:inactive', { defaultValue: 'Inactive' })}
                </span>
            )
        },
    ];

    const filters: FilterConfig[] = [
        {
            key: "is_active",
            title: t("banner:status", { defaultValue: "Status" }),
            options: [
                { label: t("common:all", { defaultValue: "All" }), value: "all" },
                { label: t("common:active", { defaultValue: "Active" }), value: "true" },
                { label: t("common:inactive", { defaultValue: "Inactive" }), value: "false" },
            ],
            defaultValue: "all",
        },
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Convert query object to query string
            const queryString = new URLSearchParams(query as any).toString();
            const res = await bannerAPI.getListWithQuery(queryString);
            if (res && res.data) {
                setData(res.data.banners);
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch banners", error);
            toast.error(t("banner:fetch_failed", { defaultValue: "Failed to fetch banners" }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [query]);

    const handleUpdateQuery = (newQuery: any) => {
        setQuery((prev) => ({ ...prev, ...newQuery }));
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await bannerAPI.remove(deleteId);
            toast.success(t("banner:deleted_success", { defaultValue: "Banner deleted" }));
            fetchData();
        } catch (error) {
            toast.error(t("banner:delete_failed", { defaultValue: "Failed to delete banner" }));
        } finally {
            setIsDeleteDialogOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">
                    {t("banner:banner_management", { defaultValue: "Banner Management" })}
                </h1>
            </div>

            <TableComponent
                columns={columns}
                data={data}
                pagination={pagination}
                updateQuery={handleUpdateQuery}
                filters={filters}
                showSearch={true}
                isRefresh={true}
                handleAddNew={() => router.push("/banners/create")}
                renderAction={(item: any) => (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/banners/${item.id}`)}
                        >
                            <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setDeleteId(item.id);
                                setIsDeleteDialogOpen(true);
                            }}
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                )}
            />

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("common:confirm_delete", { defaultValue: "Are you sure?" })}</DialogTitle>
                        <DialogDescription>
                            {t("common:delete_warning", { defaultValue: "This action cannot be undone." })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            {t("common:cancel", { defaultValue: "Cancel" })}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {t("common:delete", { defaultValue: "Delete" })}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BannersPage;
