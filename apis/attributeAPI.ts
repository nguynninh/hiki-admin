import handleAPI from './handleAPI';

const url = '/attributes';

const getList = async (query?: string) => {
    return await handleAPI(`${url}${query ? query : ''}`, undefined, 'get');
};

const create = async (data: any) => {
    return await handleAPI(`${url}`, data, 'post');
};

const update = async (id: string, data: any) => {
    return await handleAPI(`${url}/${id}`, data, 'put');
};

const remove = async (id: string) => {
    return await handleAPI(`${url}/${id}`, undefined, 'delete');
};

const attributeAPI = {
    getList,
    create,
    update,
    remove,
};

export default attributeAPI;
