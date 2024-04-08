import React, {useState, useEffect, useRef} from "react";
import { connect, ConnectedProps  } from 'react-redux'
import SignUp from '@/presentation/view/auth/SignUp'
import SignIn from "@/presentation/view/auth/SignIn";
import WelcomePage from "@/presentation/view/auth/WelcomePage";
import { AuthViewModel } from "../view-model/auth/AuthViewModel";
import { auth, resetError } from "@/store/user/user";
import type {RootStackParamList, ScreenProps} from '@/navigators/types'
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {useNavigation } from "@react-navigation/native";

import {Platform, StatusBar} from 'react-native';
import { StackActions, TabActions, useFocusEffect } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { useTranslation } from "react-i18next";



const authViewModel = new AuthViewModel()

function WelcomePageWrapper (props) {
    console.log('PROPS', props)


    return <WelcomePage {...props} vm={authViewModel}></WelcomePage>
}

const welcomeConnector = connect(null, {
   
})

export type WelcomePageWrapperHOCAllProps = ConnectedProps<typeof welcomeConnector> & {
    
}

const WelcomePageWrapperHOCWrapped =  welcomeConnector(WelcomePageWrapper)

// ==============================

function AuthFlowSignInWrapper (props) {
    
    

    return <SignIn {...props} vm={authViewModel}></SignIn>
}

function AuthFlowSignUpWrapper (props) {
    


    return <SignUp {...props} vm={authViewModel}></SignUp>
}

const authFlowWrapperConnector = connect(null, {
    auth,
    resetError
})

export type AuthFlowWrapperHOCAllProps = ConnectedProps<typeof authFlowWrapperConnector> & {
    
}

const AuthFlowSignInWrapperHOCWrapped =  authFlowWrapperConnector(AuthFlowSignInWrapper)
const AuthFlowSignUpWrapperHOCWrapped =  authFlowWrapperConnector(AuthFlowSignUpWrapper)


// ==============================

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthContainer( props ) { // hoc connect tac ac
    const navigation = useNavigation();

    const { t } = useTranslation();

    useFocusEffect(() => {
        if (Platform.OS === "ios") {       enableScreens(false);     } // CHECK
    })

    useEffect(() => {
        
        console.log('CCC')
        console.log(navigation.getParent())
        console.log('getState',navigation.getState())
        navigation.getParent()?.setOptions({
            tabBarStyle: {
                display: "none"
            },
            tabBarVisible: false
        });
    
    
        return () => {
            navigation.getParent()?.setOptions({
                tabBarStyle: {
                    display: "flex"
                },
                tabBarVisible: undefined
            });
            console.log('AUTH UNMOUNTED!')
        }
    },[])

   

    return (
        <Stack.Navigator initialRouteName="WelcomePage" screenOptions={{
            headerShown: false,
        }}>
          <Stack.Screen 
              name="WelcomePage" 
              component={WelcomePageWrapperHOCWrapped} 
             
            />
          <Stack.Screen 
              name="SignIn" 
              component={AuthFlowSignInWrapperHOCWrapped} 
              options={{
                headerBackVisible: true,
                headerShown: true,
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTitleAlign: 'center',
                headerTintColor: '#000',
                headerTitleStyle: {
                    fontFamily: 'Roboto-Bold',
                },
                headerTitle: t('screens.login.title')
              }}
            />
          <Stack.Screen 
              name="SignUp" 
              component={AuthFlowSignUpWrapperHOCWrapped}
              options={{
                headerBackVisible: true,
                headerShown: true,
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: '#fff',
                    
                },
                headerTitleAlign: 'center',
                headerTintColor: '#000',
                headerTitleStyle: {
                    fontFamily: 'Roboto-Bold',
                },
                headerTitle: t('screens.signup.title')
              }}
            />
          
        </Stack.Navigator>
    )
}


export default AuthContainer