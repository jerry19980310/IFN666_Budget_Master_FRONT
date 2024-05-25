import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./en/en.json";
import zh_TW from "./zh_TW/zh_tw.json";

const resources = {
  en: {
    translation: en,
  },
  zh_TW: {
    translation: zh_TW,
  },
};

const getLanguage = async () => {
  const storedLang = await AsyncStorage.getItem('language');
  console.log("storedLang", storedLang);
  return storedLang || Localization.getLocales()[0].languageCode;
};

getLanguage().then((lang) => {

  console.log("lang", lang);

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  fallbackLng: "en",
  lng: lang,
  interpolation: {
    escapeValue: false,
  },
});

});

export default i18n;