'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from './index';

export type Language = 'vi' | 'en' | 'jp' | 'cn';

interface I18nContextType {
    language: Language;
    changeLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
    children: ReactNode;
    defaultLanguage?: Language;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
    children,
    defaultLanguage = 'vi'
}) => {
    const [language, setLanguage] = useState<Language>(defaultLanguage);

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    const changeLanguage = (lang: Language) => {
        setLanguage(lang);
    };
    
    const t = (key: string): string => {
        if (key.includes(':')) {
            const [namespace, actualKey] = key.split(':');
            return i18n.t(actualKey, { ns: namespace });
        }

        return i18n.t(key);
    };

    return (
        <I18nContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = (): I18nContextType => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
};
