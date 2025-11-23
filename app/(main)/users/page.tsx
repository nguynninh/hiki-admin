"use client";
import { TableComponent } from "@/components/forms";
import { Card } from "@/components/ui/card";
import { useQuery, useFetchList } from "@/lib/hooks";
import UserModel from "@/models/UserModel";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Undo2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

const UsersPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [query, updateQuery, resetQuery] = useQuery({
        page: 1,
        limit: 10,
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

    const handleDelete = (item: UserModel) => {
        console.log(item);
    };

    const handleRestore = (item: UserModel) => {
        console.log(item);
    };

    return (
        <Card>
            <TableComponent
                columns={columns}
                data={users}
                pagination={pagination}
                onChangePage={(page: any) => updateQuery({ page })}
                typeList="checkbox"
                renderAction={(item: UserModel) => (
                    <div className="flex items-center justify-center gap-2">
                        <Tooltip>
                            <TooltipContent>
                                {t('common:edit')}
                            </TooltipContent>
                            <TooltipTrigger>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-blue-600"
                                    onClick={() => router.push(`/users/${item.id}/edit`)}>
                                    <Edit size={18} />
                                </button>
                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip>
                            <TooltipContent>
                                {t('common:delete')}
                            </TooltipContent>
                            <TooltipTrigger>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-red-600"
                                    onClick={() => handleDelete(item)}>
                                    <Trash2 size={18} />
                                </button>
                            </TooltipTrigger>
                        </Tooltip>
                        <Tooltip>
                            <TooltipContent>
                                {t('common:restore')}
                            </TooltipContent>
                            <TooltipTrigger>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-green-600"
                                    onClick={() => handleRestore(item)}>
                                    <Undo2 size={18} />
                                </button>
                            </TooltipTrigger>
                        </Tooltip>
                    </div>
                )}
            />
        </Card>
    );
};

export default UsersPage;
