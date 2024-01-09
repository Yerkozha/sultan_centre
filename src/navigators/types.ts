import type { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Appointment: undefined;
  Auth: undefined;
  Profile: undefined;
  SignUp: undefined;
  SignIn: undefined;
  
  BottomTabNavigators: undefined;
  StackNavigators: undefined;
  
};

export type TapOptionRoute =  {
    route: RouteProp<Record<string, object | undefined>, string>;
};

export type TabBarIconProp = { focused: boolean; color: string; size: number }

export type ScreenProps = NativeStackScreenProps<RootStackParamList>;