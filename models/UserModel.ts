interface UserModel {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    avatar: string;
    created_at: Date;
    updated_at: Date;
}

export default UserModel;