import React from "react";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, ScreenProps } from "./types";
import { Button } from "react-native";
import AppointmentContainer from "@/presentation/container/AppointmentContainer";
 

const Stack = createNativeStackNavigator<RootStackParamList>();


export function AppointmentStackNavigator({ route, navigation }: ScreenProps) {

  return (
      <Stack.Navigator>
        <Stack.Screen 
            name="Appointment" 
            component={AppointmentContainer} 
            options={(route) => ({
                title: 'Tap row clock to create event',
                headerStyle: {
                  backgroundColor: '#f2f2f2',
                },
                headerTintColor: '#000',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
            })} 
          />

          
        
      </Stack.Navigator>
  )
}



