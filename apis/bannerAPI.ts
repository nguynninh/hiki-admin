import handleAPI from "./handleAPI";

const url = `/banners`;

const getList = async (params?: any) => {
    return await handleAPI(`${url}`, undefined, "get");
};

const getListWithQuery = async (queryString: string) => {
    return await handleAPI(`${url}?${queryString}`, undefined, "get");
}

const getDetail = async (id: string) => {
    return await handleAPI(`${url}/${id}`, undefined, "get");
}

const create = async (data: FormData) => {
    return await handleAPI(`${url}`, data, "post");
}

const update = async (id: string, data: FormData) => {
    return await handleAPI(`${url}/${id}`, data, "put");
}

const remove = async (id: string) => {
    return await handleAPI(`${url}/${id}`, undefined, "delete");
}

const bannerAPI = {
    getList,
    getListWithQuery,
    getDetail,
    create,
    update,
    remove,
};

export default bannerAPI;
