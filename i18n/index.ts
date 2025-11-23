import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import viCommon from '@/i18n/locates/vi/common.json';
import enCommon from '@/i18n/locates/en/common.json';
import jpCommon from '@/i18n/locates/jp/common.json';
import cnCommon from '@/i18n/locates/cn/common.json';

const resources = {
    vi: {
        common: viCommon,
    },
    en: {
        common: enCommon,
    },
    jp: {
        common: jpCommon,
    },
    cn: {
        common: cnCommon,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'vi',
        fallbackLng: 'en',

        ns: [
            'common',
            'user',
        ],
        defaultNS: 'common',

        keySeparator: false,

        interpolation: {
            escapeValue: false,
        },

        debug: process.env.NODE_ENV === 'development',
    });

export default i18n;
