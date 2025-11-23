import { TableComponent } from "@/components/forms";

const UsersPage = () => {
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
        <div>
            <TableComponent columns={columns} data={data} />
        </div>
    );
};

export default UsersPage;
