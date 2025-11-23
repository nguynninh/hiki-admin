interface Role {
    id: string;
    name: string;
}

interface UserModel {
    id: string;
    firstname: string;
    lastname: string;
    fullname: string;
    email: string;
    roles: Role[] | string[]; // Can be Role objects or string array after mapping
    avatar: string;
    created_at: Date;
    updated_at: Date;
}

export default UserModel;