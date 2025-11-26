"use client";
import { TableComponent } from "@/components/forms";
import { Card } from "@/components/ui/card";
import { useQuery, useFetchList } from "@/lib/hooks";
import UserModel from "@/models/UserModel";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Undo2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { useState } from "react";
import handleAPI from "@/apis/handleAPI";
import { toast } from "sonner";

const UsersPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [query, updateQuery, resetQuery] = useQuery({
        page: 1,
        limit: 10,
        roles: 'all',
        is_deleted: 'false',
    });

    const [users, pagination] = useFetchList<UserModel>("/users", query);
    users.map((item) => {
        item.fullname = item.lastname + " " + item.firstname;
        if (item.roles.length > 0 && typeof item.roles[0] === 'object') {
            item.roles = (item.roles as any[]).map((role) => t(`user:${role.name.toLocaleLowerCase()}`));
        }
    });

    const columns = [
        {
            title: "Tên",
            dataIndex: "fullname",
            key: "fullname",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            type: "email",
        },
        {
            title: "Quyền hạn",
            dataIndex: "roles",
            key: "roles",
            type: "tags",
        }
    ];

    const handleSoftDelete = async (item: UserModel) => {
        setIsLoading(true);

        try {
            const response: any = await handleAPI(`/users/${item.id}`, {}, 'delete');
            toast.success(response.message);

            updateQuery({
                page: 1,
                limit: query.limit,
                roles: query.roles,
                is_deleted: 'true',
            });
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleHardDelete = async (item: UserModel) => {
        console.log(item);
    };

    const handleRestore = async (item: UserModel) => {
        setIsLoading(true);

        try {
            const response: any = await handleAPI(`/users/${item.id}/restore`, {}, 'put');
            toast.success(response.message);

            resetQuery();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAll = async (ids: string[]) => {
        console.log(ids);
    };

    return (
        <TableComponent
            columns={columns}
            data={users}
            pagination={pagination}
            updateQuery={updateQuery}
            typeList="checkbox"
            renderAction={(item: UserModel) => (
                <div className="flex items-center justify-center gap-2">
                    {!item.deleted_at && (
                        <>
                            <Tooltip>
                                <TooltipContent>
                                    {t('common:edit')}
                                </TooltipContent>
                                <TooltipTrigger>
                                    <div className="p-2 hover:bg-gray-100 rounded-full transition-colors text-blue-600"
                                        onClick={() => router.push(`/users/${item.id}/edit`)}>
                                        <Edit size={18} />
                                    </div>
                                </TooltipTrigger>
                            </Tooltip>
                            <Tooltip>
                                <TooltipContent>
                                    {t('common:soft_delete')}
                                </TooltipContent>
                                <TooltipTrigger>
                                    <div className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-600"
                                        onClick={() => handleSoftDelete(item)}>
                                        <Trash2 size={18} />
                                    </div>
                                </TooltipTrigger>
                            </Tooltip>
                        </>
                    )}
                    {item.deleted_at && (
                        <>
                            <Tooltip>
                                <TooltipContent>
                                    {t('common:hard_delete')}
                                </TooltipContent>
                                <TooltipTrigger>
                                    <div className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-600"
                                        onClick={() => handleHardDelete(item)}>
                                        <Trash2 size={18} />
                                    </div>
                                </TooltipTrigger>
                            </Tooltip>
                            <Tooltip>
                                <TooltipContent>
                                    {t('common:restore')}
                                </TooltipContent>
                                <TooltipTrigger>
                                    <div className="p-2 hover:bg-gray-100 rounded-full transition-colors text-green-600"
                                        onClick={() => handleRestore(item)}>
                                        <Undo2 size={18} />
                                    </div>
                                </TooltipTrigger>
                            </Tooltip>
                        </>
                    )}
                </div>
            )}
            changeColumns
            isRefresh
            showSearch
            filters={[
                {
                    key: 'roles',
                    title: t('user:roles'),
                    value: query.roles,
                    defaultValue: 'all',
                    options: [
                        { label: t('user:roles_all'), value: 'all' },
                        { label: t('user:user'), value: 'user' },
                        { label: t('user:seller'), value: 'seller' },
                        { label: t('user:admin'), value: 'admin' },
                    ],
                },
                {
                    key: 'is_deleted',
                    title: t('user:is_deleted'),
                    value: query.is_deleted,
                    defaultValue: 'false',
                    options: [
                        { label: t('user:is_deleted_all'), value: 'all' },
                        { label: t('user:is_deleted_active'), value: 'false' },
                        { label: t('user:is_deleted_deleted'), value: 'true' },
                    ],
                }
            ]}
            handleDeleteAll={(ids) => handleDeleteAll(ids)}
        />
    );
};

export default UsersPage;
