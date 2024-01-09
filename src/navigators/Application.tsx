import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList, TabBarIconProp, TapOptionRoute } from "./types";
import { StatusBar, StyleSheet } from "react-native";
import { Colors } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigationRef } from './utils';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HomeContainer } from '@/presentation/container/HomeContainer';
import ProfileContainer from '@/presentation/container/ProfileContainer';
import AppointmentContainer from '@/presentation/container/AppointmentContainer';
import AuthContainer from '@/presentation/container/AuthContainer';

import { StackNavigators } from './StackNavigators';
import { useAppSelector } from '@/hooks/useStore';
import { Base } from '@/api';
import { RequestEngine, ResponseEngine } from '@/api/interceptors';


const Tab = createBottomTabNavigator<RootStackParamList>();

const tabScreenOption = ({ route }: TapOptionRoute) => ({
    tabBarIcon: ({ focused, color, size }: TabBarIconProp) => {
    let iconName = "";

    if (route.name === 'Home') {
        iconName = focused
        ? 'information-circle'
        : 'information-circle-outline';
    } else if (route.name === 'StackNavigators') {
        iconName = focused ? 'list' : 'list-outline';
    } else if (route.name === 'Profile') {
        iconName = focused ? 'accessibility' : 'accessibility-outline';
    } else if(route.name === 'SignIn'){
        iconName = focused ? 'list' : 'list-outline';
    } else if(route.name === 'SignUp'){
        iconName = focused ? 'list' : 'list-outline';
    }

    // You can return any component that you like here!
    return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
    headerShown: false
})

export function AppNavigators () {
   
    const accessToken = useAppSelector(state => state.user.access)

    useEffect(() => {
        Base.getInstance().attachInterceptorEngine(new RequestEngine()).attachInterceptorEngine(new ResponseEngine())
    }, [])
    
    return (
        <SafeAreaView style={styles.container}>
            <NavigationContainer ref={navigationRef}>
                <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} /> 
                <Tab.Navigator
                    screenOptions={tabScreenOption}
                >
                    <Tab.Screen name="Home"  component={HomeContainer} options={{title: 'Bla', headerShown: true}} />
                    { accessToken ? (
                    <>
                        <Tab.Screen name="StackNavigators"  component={StackNavigators} />
                        <Tab.Screen name="Profile"          component={ProfileContainer} />
                    </>
                ) : (
                    <>
                        <Tab.Screen name="SignIn"  component={AuthContainer} />
                        <Tab.Screen name="SignUp"  component={AuthContainer} />
                    </>
                )}
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    }
})
