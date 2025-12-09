import handleAPI from "./handleAPI";

const url = `/users`;

const getList = async (params?: string) => {
    return await handleAPI(`${url}${params ? `?${params}` : ''}`, undefined, "get");
};

const approveSeller = async (id: string) => {
    return await handleAPI(`${url}/approve-seller/${id}`, {}, "post");
};

const rejectSeller = async (id: string) => {
    return await handleAPI(`${url}/reject-seller/${id}`, {}, "post");
};

const userAPI = {
    getList,
    approveSeller,
    rejectSeller,
};

export default userAPI;
