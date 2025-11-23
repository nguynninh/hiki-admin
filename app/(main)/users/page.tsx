"use client";
import { TableComponent } from "@/components/forms";
import { Card } from "@/components/ui/card";
import { useQuery, useFetchList } from "@/lib/hooks";
import UserModel from "@/models/UserModel";
import { useTranslation } from "react-i18next";

const UsersPage = () => {
    const { t } = useTranslation();
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

    return (
        <Card>
            <TableComponent
                columns={columns}
                data={users}
                pagination={pagination}
                onChangePage={(page: any) => updateQuery({ page })}
                typeList="checkbox"
            />
        </Card>
    );
};

export default UsersPage;
