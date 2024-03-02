import React from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import { ProfileProps } from "./types";
import { RootStackParamList } from "@/navigators/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileContainerAllProps } from "@/presentation/container/ProfileContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

export type ProfileRouteParams = NativeStackScreenProps<RootStackParamList, 'Profile'>;
/**
 * 
 * Settings, auth
 */

function Profile({vm, auth}: ProfileProps & ProfileContainerAllProps & ProfileRouteParams) {
    const { t, i18n } = useTranslation(); //i18n instance
    const onLogoutHandler = () => {
        auth({
            email: '',
            password: '',
            type: 'logout'
        }).unwrap().then(async() => {
            await AsyncStorage.clear()
        }).catch((error) => {

            console.log('LAST UI POINT', error)
            
        })
    }
    
    return <View>
        <View>
            <TouchableOpacity onPress={() => i18n.changeLanguage("kz")}>
                <Text>Kazakh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => i18n.changeLanguage("en")}>
                <Text>English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => i18n.changeLanguage("ru")}>
                <Text>Russian</Text>
            </TouchableOpacity>
        </View>
        <Text>Profile</Text>
        <Button title={t("screens.logout.text.logout")} onPress={onLogoutHandler}></Button> 
    </View>
}


export default Profile