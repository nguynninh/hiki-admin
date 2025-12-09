import { localDataNames } from "@/constants/appInfos";
import axiosClient from './axiosClient';

const url = '/files';

const upload = async (file: File) => {
    const getAssetToken = () => {
        const res = localStorage.getItem(localDataNames.authData);

        if (res) {
            const auth = JSON.parse(res);
            return auth && auth.access_token ? auth.access_token : "";
        } else {
            return "";
        }
    };

    const formData = new FormData();
    formData.append('file', file);
    return await axiosClient.post(`${url}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${getAssetToken()}`,
        },
    });
};

const fileAPI = {
    upload,
};

export default fileAPI;
