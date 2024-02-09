import React from "react";
import { Text, View, Button } from "react-native";
import { ProfileProps } from "./types";
import { RootStackParamList } from "@/navigators/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileContainerAllProps } from "@/presentation/container/ProfileContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ProfileRouteParams = NativeStackScreenProps<RootStackParamList, 'Profile'>;
/**
 * 
 * Settings, auth
 */

function Profile({vm, auth}: ProfileProps & ProfileContainerAllProps & ProfileRouteParams) {

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
        <Text>Profile</Text>
        <Button title="Logout" onPress={onLogoutHandler}></Button> 
    </View>
}


export default Profile