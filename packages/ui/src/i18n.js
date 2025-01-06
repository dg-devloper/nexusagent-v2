import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    },
    resources: {
        en: {
            translation: {
                title: 'Multi-language app',
                Chatflows: 'Chatflows'
            }
        },
        id: {
            translation: {
                Chatflows: 'Alurchat',
                title: 'Alurchat'
            }
        }
    }
})

export default i18n
