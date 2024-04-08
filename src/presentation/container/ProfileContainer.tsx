import React from 'react'
import {connect, ConnectedProps} from 'react-redux'
import Profile, { ProfileRouteParams } from '@/presentation/view/profile/Profile'
import {ProfileViewModel} from '@/presentation/view-model/profile/ProfileViewModel'
import { auth, resetError } from '@/store/user/user'
import { RootState } from '@/store'
import { RootStackParamList } from '@/navigators/types'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAppSelector, useAppDispatch } from '@/hooks/useStore'
import AuthContainer from "@/presentation/container/AuthContainer";
import { useTranslation } from 'react-i18next'

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useNavigation } from "@react-navigation/native";
import { TabActions } from "@react-navigation/native";

import Ionicons from 'react-native-vector-icons/Ionicons';

const profileViewModel = new ProfileViewModel()

const Stack = createNativeStackNavigator<RootStackParamList>();

function ProfileContainer (props: ProfileContainerAllProps & ProfileRouteParams) {


    return <Profile {...props} vm={profileViewModel}></Profile>
}

const connector = connect((state: RootState) => ({accessToken: state.user.access}), {
    auth,
    resetError
})

export type ProfileContainerAllProps = ConnectedProps<typeof connector> & {
    
}

const ProfileContainerWrapped = connector(ProfileContainer);

function  ProfileStackNavigator() {
    
    const accessToken = useAppSelector(state => state.user.access);
    const {t} = useTranslation()
    const dispatch = useAppDispatch();
    const navigation = useNavigation()

    const onLogoutHandler = () => {
        dispatch(auth({
            email: '',
            password: '',
            type: 'logout'
        })).unwrap().then(async() => {
            await AsyncStorage.clear()
            
        }).catch((error) => {

            console.log('LAST UI POINT', error)
            
        }).finally(() => {
            navigation.dispatch(TabActions.jumpTo('HomeContainer'))
        })
    }


    return (<Stack.Navigator screenOptions={{headerShown: false}}>
        { accessToken ? (<Stack.Screen name='Profile' component={ProfileContainerWrapped} options={{
                                headerShown: true,
                                title: t('screens.settings.profile'),
                                headerRight: () => (
                                    <Ionicons name="exit-outline" color={'tomato'} size={24} onPress={onLogoutHandler}
                                    style={{
                                        marginRight: 7
                                    }}
                                    />
                                ),
                                headerTitleAlign: 'center',
                                headerTitleStyle: {
                                    fontSize: 18
                                },
                                }
                            } />)
            : (<Stack.Screen name='Auth' component={AuthContainer} options={{headerShown: false}} />)
            }
    </Stack.Navigator>)
}

export default ProfileStackNavigator