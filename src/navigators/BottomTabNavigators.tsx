import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./types";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HomeContainer } from "@/presentation/container/HomeContainer";
import AppointmentContainer from "@/presentation/container/AppointmentContainer";

const Tab = createBottomTabNavigator<RootStackParamList>();

export function BottomTabNavigators () {

    return (<Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "";
  
            if (route.name === 'Home') {
              iconName = focused
                ? 'information-circle'  
                : 'information-circle-outline';
            } else if (route.name === 'Appointment') {
              iconName = focused ? 'list' : 'list-outline';
            }
  
            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeContainer} />
        <Tab.Screen name="Appointment" component={AppointmentContainer} />
      </Tab.Navigator>)
  }