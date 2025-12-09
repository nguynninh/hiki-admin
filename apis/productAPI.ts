import handleAPI from './handleAPI';

const url = '/products';

const create = async (data: any) => {
    return await handleAPI(`${url}`, data, 'post');
};

const getList = async (query: string) => {
    return await handleAPI(`${url}${query}`, undefined, 'get');
};

const getDetail = async (id: string) => {
    return await handleAPI(`${url}/${id}`, undefined, 'get');
};

const update = async (id: string, data: any) => {
    return await handleAPI(`${url}/${id}`, data, 'put');
};

const remove = async (id: string) => {
    return await handleAPI(`${url}/${id}`, undefined, 'delete');
};

const restore = async (id: string) => {
    return await handleAPI(`${url}/${id}/restore`, undefined, 'put'); // Assuming restore logic exists or will exist usually post/put
}

const productAPI = {
    create,
    getList,
    getDetail,
    update,
    remove,
    restore
};

export default productAPI;
