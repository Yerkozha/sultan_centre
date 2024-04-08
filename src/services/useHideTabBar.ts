import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';
import { StackActions, TabActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";

export const useHideTabBar = () => {
    const navigation = useNavigation()

    useFocusEffect(() => {
        if (Platform.OS === "ios") {       enableScreens(false);     } // CHECK
      })
      
    useEffect(() => {
    const unsubsribe = navigation.addListener('blur', () => {
        console.log('BLUR')
        navigation.getParent()?.setOptions({
        tabBarStyle: {
            display: "flex"
        },
        tabBarVisible: undefined
        });

    });
    
    navigation.getParent()?.setOptions({
        tabBarStyle: {
            display: "none"
        },
        tabBarVisible: false
    });


    return () => {
        unsubsribe()
    }

    },[navigation]) // CHECK SHOULD NOT UN MOUNT ? STACK << TAB useFocusEffect ?!

}