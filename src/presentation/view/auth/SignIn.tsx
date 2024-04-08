import React, { useCallback, useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Pressable } from "react-native";
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { AuthFlowWrapperHOCAllProps } from "@/presentation/container/AuthContainer";
import {AuthProps} from './types'
import { ScreenProps } from "@/navigators/types";
import { useAppSelector } from "@/hooks/useStore";
import { useValidate } from "@/hooks/useValidate";
import { styles } from "./style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {TabActions } from "@react-navigation/native";
import { navigationRef } from "@/navigators/utils";
import { useTranslation } from "react-i18next";

import Toast from 'react-native-toast-message';


function SignIn({vm, auth, resetError, navigation}: AuthFlowWrapperHOCAllProps & AuthProps & ScreenProps ) {
    
    const [loader, setLoader] = useState(false)
    const user = useAppSelector(state => state.user)
    const {errors, email, password, setEmail, setPassword, isFormValid, setIsFormValid, isDirtyFields: {email: e, password: p}, setDirtyFields} = useValidate(resetError)
    
    const { t } = useTranslation()
    
    useEffect(() => {
        
        if( user.authenticatedUser?.email ) {
            setEmail(user.authenticatedUser?.email)
            setPassword(user.password)
            setIsFormValid(true)
        }

    }, [])

    function onSumbitHandler() {
        
        
        if( isFormValid ) {

            setLoader(true)
            
            auth({
                type: 'login',
                email,
                password
            }).unwrap().then((data) => {
                console.log('LOGIN',data)
                console.log('RR',data['refresh'])
                AsyncStorage.setItem('access', data['access'])
                AsyncStorage.setItem('refresh', data['refresh'])
                navigationRef.dispatch(TabActions.jumpTo('HomeContainer'))
            }).catch((error) => {

                if( 'non_field_errors' in error ) {
                    return Toast.show({
                        type: 'customToast',
                        text1: error['non_field_errors'],
                        
                    })
                }
                Toast.show({type: 'customToast', text1: JSON.stringify(error)})
            }).finally(() => {
                setLoader(false)
            })
           
        }   
    }
    function linkHandler() {
        navigation.push('SignUp')
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.innerWrapper}>
            
                <View style={styles.inputWrapper}>
                    <TextInput 
                    mode="outlined"
                    label="Email"
                        style={styles.input}
                        error={ e }
                        placeholder="Email"
                        onChangeText={(text) => {
                            setDirtyFields((s) => ({...s, email: true}))
                            setEmail(text)}}
                        value={email}
                    />
                    { e && <Text style={styles.errorText}>{ errors.email }</Text>}
                </View>

                <View style={styles.inputWrapper}>
                    <TextInput 
                    mode="outlined"
                    label="Password"
                        style={styles.input}
                        error={ p }
                        placeholder="Password"
                        onChangeText={(text) => {
                            setDirtyFields((s) => ({...s, password: true}))
                            setPassword(text)}}
                        value={password}
                        secureTextEntry
                        
                    />
                    { p && <Text style={styles.errorText}>{ errors.password }</Text>}
                </View>

                <Pressable style={styles.linkWrapper} onPress={linkHandler} >
                    {({pressed}) => (
                        <Text style={[styles.link,{color: (pressed ? 'rgb(148, 149, 151)' : '#067e66') }]}>{t('screens.login.createAccount')}</Text>
                    )}
                </Pressable>

                <TouchableOpacity  
                    style={[styles.introBtn, { opacity: isFormValid ? 1 : 0.5, backgroundColor: isFormValid? '#48BB78': 'grey', marginTop: 10 }]} 
                    disabled={!isFormValid || loader}  onPress={onSumbitHandler}> 
                    { loader ? <ActivityIndicator size={'small'} color="#fff" /> :<Text style={styles.buttonText}>{t('screens.login.title')}</Text>} 
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default SignIn