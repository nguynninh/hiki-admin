import { redirect } from "next/navigation";

const UsersPage = () => {
    redirect("/users/list");
};

export default UsersPage;