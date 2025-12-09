"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TableComponent from "@/components/forms/TableComponent";
import userAPI from "@/apis/userAPI";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Pagination } from "@/models/Pagination";

const SellerRequestsPage = () => {
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
        seller_request_status: 'pending'
    });

    const handleApprove = async (id: string) => {
        try {
            await userAPI.approveSeller(id);
            toast.success(t('user:seller_approved_success', { defaultValue: 'Seller approved successfully' }));
            setRefreshKey(prev => prev + 1);
        } catch (error: any) {
            toast.error(error.message || t('common:error_occurred'));
        }
    };

    const handleReject = async (id: string) => {
        try {
            await userAPI.rejectSeller(id);
            toast.success(t('user:seller_rejected_success', { defaultValue: 'Seller rejected successfully' }));
            setRefreshKey(prev => prev + 1);
        } catch (error: any) {
            toast.error(error.message || t('common:error_occurred'));
        }
    };

    const columns: any[] = [
        {
            key: "logo",
            title: t("store:logo", { defaultValue: "Logo" }),
            render: (item: any) => (
                <div className="w-10 h-10 relative overflow-hidden rounded-full border border-gray-200">
                    <img
                        src={item.store?.logo || "https://img.icons8.com/color/48/shop.png"}
                        alt="Store Logo"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = "https://img.icons8.com/color/48/shop.png" }}
                    />
                </div>
            )
        },
        {
            key: "store_name",
            title: t("store:store_name", { defaultValue: "Store Name" }),
            render: (item: any) => <span className="font-medium">{item.store?.store_name || "N/A"}</span>
        },
        {
            key: "email",
            title: t("user:email", { defaultValue: "Email" }),
            sortable: true,
        },
        {
            key: "phone",
            title: t("store:phone", { defaultValue: "Phone" }),
            render: (item: any) => <span>{item.store?.phone || "N/A"}</span>
        },
        {
            key: "address",
            title: t("store:address", { defaultValue: "Address" }),
            render: (item: any) => (
                <div className="max-w-[200px] truncate" title={item.store?.address}>
                    {item.store?.address || "N/A"}
                </div>
            )
        },
        {
            key: "seller_request_status",
            title: t("user:status", { defaultValue: "Status" }),
            render: (item: any) => (
                <span className={`px-2 py-1 rounded-full text-xs ${item.seller_request_status === 'approved' ? 'bg-green-100 text-green-800' :
                    item.seller_request_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {item.seller_request_status}
                </span>
            ),
        },
        {
            key: "actions",
            title: t("common:actions", { defaultValue: "Actions" }),
            render: (item: any) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={async () => handleApprove(item.id)}
                    >
                        <Check size={16} className="mr-1" />
                        {t('common:approve', { defaultValue: "Approve" })}
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => handleReject(item.id)}
                    >
                        <X size={16} className="mr-1" />
                        {t('common:reject', { defaultValue: "Reject" })}
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

            const res = await userAPI.getList(queryString);
            if (res.data && res.data.users) {
                setData(res.data.users);
                // Ensure pagination structure matches model
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

    const updateQuery = (newQuery: any) => {
        setQuery(prev => ({ ...prev, ...newQuery }));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                {t('user:seller_requests', { defaultValue: "Seller Requests" })}
            </h1>
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

export default SellerRequestsPage;
