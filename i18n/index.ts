import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import viCommon from '@/i18n/locates/vi/common.json';
import enCommon from '@/i18n/locates/en/common.json';
import jpCommon from '@/i18n/locates/jp/common.json';
import cnCommon from '@/i18n/locates/cn/common.json';

import viUser from '@/i18n/locates/vi/user.json';
import enUser from '@/i18n/locates/en/user.json';
import jpUser from '@/i18n/locates/jp/user.json';
import cnUser from '@/i18n/locates/cn/user.json';

const resources = {
    vi: {
        common: viCommon,
        user: viUser,
    },
    en: {
        common: enCommon,
        user: enUser,
    },
    jp: {
        common: jpCommon,
        user: jpUser,
    },
    cn: {
        common: cnCommon,
        user: cnUser,
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
