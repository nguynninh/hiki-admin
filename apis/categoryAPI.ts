import handleAPI from './handleAPI';

const url = '/categories';

const getList = async (query?: string) => {
    return await handleAPI(`${url}${query ? query : ''}`, undefined, 'get');
};

const create = async (data: any) => {
    return await handleAPI(`${url}`, data, 'post');
};

const categoryAPI = {
    getList,
    create,
    update: async (id: string, data: any) => await handleAPI(`${url}/${id}`, data, 'put'),
    remove: async (id: string) => await handleAPI(`${url}/${id}`, undefined, 'delete'),
};

export default categoryAPI;
