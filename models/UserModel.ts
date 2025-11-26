interface Role {
    id: string;
    name: string;
}

interface UserModel {
    id: string;
    firstname: string;
    lastname: string;
    fullname: string;
    password: string;
    email: string;
    roles: Role[] | string[];
    avatar: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export default UserModel;