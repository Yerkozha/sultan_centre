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
import ProfileStackNavigator from '@/presentation/container/ProfileContainer';

import { AppointmentStackNavigator } from './StackNavigators';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';

import { ConnectedProps, connect, shallowEqual, useStore } from 'react-redux';
import { RootState } from '@/store';


const Tab = createBottomTabNavigator<RootStackParamList>();

const tabScreenOption = ({ route }: TapOptionRoute) => ({
    tabBarIcon: ({ focused, color, size }: TabBarIconProp) => {
    let iconName = "";

    if (route.name === 'HomeContainer') {
        iconName = focused ? 'moon-sharp' : 'moon-outline';
    } else if (route.name === 'AppointmentStackNavigator') {
        iconName = focused ? 'book' : 'book-outline';
    } else if (route.name === 'ProfileStackNavigator') {
        iconName = focused ? 'grid' : 'grid-outline';
        
    } else if(route.name === 'SignIn'){
        iconName = focused ? 'book' : 'book-outline';
    } else if(route.name === 'SignUp'){
        iconName = focused ? 'grid' : 'grid-outline';
    }

    // You can return any component that you like here!
    return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'tomato',
    tabBarInactiveTintColor: 'gray',
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarLabel: () => null,
})



function AppNavigators ({access}) {
   console.log('access', access)

   const accessToken = useAppSelector(state => state.user.access);
    console.log('accessToken', accessToken)
    

    return (
        <SafeAreaView style={styles.container}>
            <NavigationContainer ref={navigationRef}>
                <StatusBar animated={true} barStyle={'dark-content'} backgroundColor={Colors.white} /> 
                <Tab.Navigator
                    screenOptions={tabScreenOption}
                >
                    <Tab.Screen name="HomeContainer"  component={HomeContainer}
                        listeners={({navigation}) => ({
                            tabPress: (event) => {
                                event.preventDefault();
                                navigation.navigate('Articles')
                            }
                        })}
                    />
                    <Tab.Screen name="AppointmentStackNavigator"  component={AppointmentStackNavigator}
                    />
                    <Tab.Screen name="ProfileStackNavigator"          component={ProfileStackNavigator} 
                            
                    />
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
        backgroundColor: Colors.backgroundColor,
        
    }
})
