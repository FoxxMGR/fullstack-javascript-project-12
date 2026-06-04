import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ruTranslations from './locales/ru.json';

const resources = {
  ru: {
    translation: ruTranslations.translation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // дефолтная локаль - ru, автоматическое определение НЕ используется
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false, // React уже экранирует значения
    },
  });

export default i18n;