import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './translate/en/translation.json'
import fr from './translate/fr/translation.json'

i18n.use(initReactI18next).init({
    resources: {
        en: {translation: en},
        fr: {translation: fr},
    },
    fallbackLn: 'en',
    interpolation: {
        escapeValue: false
    }

       


})
export default i18n;