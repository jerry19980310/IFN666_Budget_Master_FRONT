import React, { useEffect } from "react";
import { Text, Switch, View, StyleSheet } from "react-native";
import { Select, CheckIcon, Center, VStack, HStack } from "native-base";
import { GlobalLayout } from "../components/Layout";
import { useMyTheme } from "../context/mytheme";
import { GlobalStyles } from "../styles/global";
import { useTranslation } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../locales/i18next";

export default function SettingsScreen() {

  const { isLargeText, setIsLargeText } = useMyTheme();
  const { isBoldText, setIsBoldText } = useMyTheme();
  const { language, setLanguage } = useMyTheme();
  const globalStyles = GlobalStyles();
  const { t } = useTranslation();
  let lang = language;

  const showlanguage = () => {
    if (language === 'en') {
      lang = 'English';
    } else if (language === 'zh_TW') {
      lang = 'Traditional Chinese';
    }
  };

  const changeLang = (itemValue) => {
    i18n.changeLanguage(itemValue);
  };

  useEffect(() => {
    showlanguage();
  }, [language]);

  return (
    <GlobalLayout>
      <VStack space={4} p={4}>
        <VStack space={2}>
          <Text style={globalStyles.heading}>{t('text')}:</Text>
          <HStack space={3} alignItems="center">
            <Text style={globalStyles.text}>{t('large')}</Text>
            <Switch
              value={isLargeText}
              onValueChange={async () => {
                await AsyncStorage.setItem("isLargeText", JSON.stringify(!isLargeText));
                setIsLargeText(!isLargeText);
              }}
              trackColor={{ false: "#767577", true: "#96B6C5" }}
            />
          </HStack>
        </VStack>
        <VStack space={2}>
          <HStack space={3} alignItems="center">
            <Text style={globalStyles.text}>{t('bold')}</Text>
            <Switch
              value={isBoldText}
              onValueChange={async () => {
                await AsyncStorage.setItem("isBoldText", JSON.stringify(!isBoldText));
                setIsBoldText(!isBoldText);
              }}
              trackColor={{ false: "#767577", true: "#96B6C5" }}
            />
          </HStack>
        </VStack>
        <VStack space={2}>
          <Text style={globalStyles.heading}>{t('language')}:</Text>
          <Select
            selectedValue={lang}
            minWidth="200"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}
            mt={1}
            onValueChange={async (itemValue) => {
              setLanguage(itemValue);
              changeLang(itemValue);
              await AsyncStorage.setItem("language", JSON.stringify(itemValue));
            }}
            style={globalStyles.text}
          >
            <Select.Item label="English" value="en" />
            <Select.Item label="Traditional Chinese" value="zh_TW" />
          </Select>
        </VStack>
      </VStack>
    </GlobalLayout>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
  },
});
