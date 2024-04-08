import React from "react";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, ScreenProps } from "./types";
import { Button } from "react-native";
import AppointmentContainer from "@/presentation/container/AppointmentContainer";
import { useAppSelector } from "@/hooks/useStore";
import AuthContainer from "@/presentation/container/AuthContainer";
 
import { useIsFocused } from '@react-navigation/native';
import { Loader } from "@/services/Loader";


const Stack = createNativeStackNavigator<RootStackParamList>();



export function AppointmentStackNavigator({ route, navigation }: ScreenProps) {
  
  const accessToken = useAppSelector(state => state.user.access);
  const isFocused = useIsFocused();
  const isAreaActive = useAppSelector((state) => state.appointment.isAreaActive)
  console.log("accessToken" , accessToken)
  console.log("isFocused" , isFocused)
  console.log("isAreaActive" , isAreaActive)

  return (
      <Stack.Navigator initialRouteName="Appointment">
        
        { (accessToken && isAreaActive) ?   
        (
          <Stack.Screen 
            name="Appointment" 
            component={AppointmentContainer} 
            options={(route) => ({
                headerStyle: {
                  backgroundColor: '#f2f2f2',
                },
                headerTintColor: '#000',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerShown: false,
                
            })} 
          />) :
        (accessToken && isFocused)
          ? (
            <Stack.Screen 
              name="Appointment" 
              component={AppointmentContainer} 
              options={(route) => ({
                  headerStyle: {
                    backgroundColor: '#f2f2f2',
                  },
                  headerTintColor: '#000',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                  headerShown: false,
                  
              })} 
            />) : (
                <Stack.Screen 
                  name="Auth" 
                  component={ (accessToken && !isFocused)? Loader : AuthContainer} 
                  options={(route) => ({
                      headerShown: false,
                      
                  })} 
                />)
            }
      </Stack.Navigator>
  )
}



