import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import English from "./locales/en/translations.json"
import Spanish from './locales/es/translations.json'
import Hindi from './locales/hi/translations.json'
import French from './locales/fr/translations.json'
import Russian from './locales/ru/translations.json'
i18n.use(initReactI18next).init({
    fallbackLng: 'en',
    lng: 'en',
    resources: {
        en: {
            translations: English
        },
        es: {
            translations: Spanish
        },
        fr: {
            translations: French
        },
        hi: {
            translations: Hindi
        },
        ru: {
            translations: Russian
        }
    },
    ns: ['translations'],
    defaultNS: 'translations'
});

i18n.languages = ['en', 'es', "fr", "hi", "ru"];

export default i18n;

export const LanguagesSupported = [
    {
        code: 'en',
        label: "English"
    },
    {
        code: "es",
        label: "Spanish"
    },
    {
        code: "fr",
        label: "French"
    },
    {
        code: "hi",
        label: "Hindi"
    },
    {
        code: "ru",
        label: "Russian"
    }
]