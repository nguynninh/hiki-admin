"use client";
import { TableComponent } from "@/components/forms";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const UsersPage = () => {
    const [loading, setLoading] = useState(false);
    const columns = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        }
    ];

    const data = [
        {
            username: "John Doe",
            email: "john.doe@example.com",
            role: "Admin",
        },
    ];
    return (
        <Card>
            <TableComponent columns={columns} data={data} />
        </Card>
    );
};

export default UsersPage;
