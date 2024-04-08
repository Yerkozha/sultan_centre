import React from 'react'
import {View, TouchableOpacity, Text} from 'react-native'
import { useTranslation } from "react-i18next";
import { Divider, Menu } from 'react-native-paper';

export default function LanguageSwitcher({toggleDarken, bottomSheetTab}) {

    const { t, i18n } = useTranslation(); //i18n instance
    const switchHandler = (value) => {
        toggleDarken(false, value)
        i18n.changeLanguage(value)
        bottomSheetTab.current.closeBottomSheet()
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => switchHandler("kz")}>
                <Menu.Item title="Қазақша" />
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => switchHandler("en")}>
                <Menu.Item title="English" />
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => switchHandler("ru")}>
                <Menu.Item title="Русский" />
            </TouchableOpacity>
        </View>
    )
}