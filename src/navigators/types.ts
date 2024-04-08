import { Article } from '@/store/articles/articles';
import type { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Articles: undefined;
  ArticlePage: {
    article: Article
  };
  HomeContainer: undefined;
  Appointment: undefined;
  Auth: undefined;
  Profile: undefined;
  SignUp: undefined;
  SignIn: undefined;
  WelcomePage: undefined;
  TestComponent: undefined;
  
  BottomTabNavigators: undefined;
  AppointmentStackNavigator: undefined;
  ProfileStackNavigator: undefined;
  
};

export type TapOptionRoute =  {
    route: RouteProp<Record<string, object | undefined>, string>;
};

export type TabBarIconProp = { focused: boolean; color: string; size: number }

export type ScreenProps = NativeStackScreenProps<RootStackParamList>;