import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList, TabBarIconProp, TapOptionRoute } from "./types";
import { StatusBar, StyleSheet } from "react-native";
import { Colors } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigationRef } from './utils';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {HomeContainer} from '@/presentation/container/HomeContainer';
import ProfileContainer from '@/presentation/container/ProfileContainer';
import AuthContainer from '@/presentation/container/AuthContainer';

import { AppointmentStackNavigator } from './StackNavigators';
import { useAppSelector } from '@/hooks/useStore';
import { Base } from '@/api';
import { RequestEngine, ResponseEngine } from '@/api/interceptors';
import { ConnectedProps, connect, shallowEqual, useStore } from 'react-redux';
import { RootState } from '@/store';

const Tab = createBottomTabNavigator<RootStackParamList>();

const tabScreenOption = ({ route }: TapOptionRoute) => ({
    tabBarIcon: ({ focused, color, size }: TabBarIconProp) => {
    let iconName = "";

    if (route.name === 'Home') {
        iconName = focused
        ? 'information-circle'
        : 'information-circle-outline';
    } else if (route.name === 'AppointmentStackNavigator') {
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



function AppNavigators ({access}) {
   console.log('access', access)

   const accessToken = (useStore().getState() as RootState).user.access
    console.log('accessToken', accessToken)
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
                    <Tab.Screen name="HomeContainer"  component={HomeContainer} />
                    {/*  options={{title: 'Bla', headerShown: true}} */}
                    { accessToken ? (
                    <>
                        <Tab.Screen name="AppointmentStackNavigator"  component={AppointmentStackNavigator} />
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

const connector = connect((state: RootState) => ({access: state.user.access}))

export type AuthContainerAllProps = ConnectedProps<typeof connector> & {
    
}

export default connector(AppNavigators)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    }
})
