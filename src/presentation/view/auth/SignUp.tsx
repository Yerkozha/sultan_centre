import React, { useCallback, useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { ActivityIndicator, TextInput } from 'react-native-paper';

import { AuthFlowWrapperHOCAllProps } from "@/presentation/container/AuthContainer";
import {AuthProps} from './types'
import { ScreenProps } from "@/navigators/types";
import { useValidate } from "@/hooks/useValidate";
import { styles } from "./style";
import { useAppSelector } from "@/hooks/useStore";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TabActions } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

function SignUp({vm, auth, resetError, navigation}: AuthFlowWrapperHOCAllProps & AuthProps & ScreenProps ) {

    const [loader, setLoader] = useState(false)
    const {errors, email, password, setEmail, setPassword, isFormValid, setIsFormValid, isDirtyFields: {email: e, password: p}, setDirtyFields} = useValidate(resetError)
    const { t } = useTranslation()
    
    function onSumbitHandler() {

        if( isFormValid ) {

            setLoader(true)

            auth({
                type: 'registration',
                email,
                password
            }).unwrap().then(() => {
                (async() =>{

                    try {
                        setLoader(true)
                        const data = await auth({
                            type: 'login',
                            email,
                            password
                        }).unwrap()
    
                        AsyncStorage.setItem('access', data['access'])
                        AsyncStorage.setItem('refresh', data['refresh'])
    
                        navigation.dispatch(TabActions.jumpTo('HomeContainer'))
    
                    } catch(error) {
                        if( 'non_field_errors' in error ) {
                            return Toast.show({type: 'customToast', text1: error['non_field_errors']})
                        }
                        Toast.show({type: 'customToast', text1: JSON.stringify(error)})
                    } finally{
                        setLoader(false)
                    }

                })()
                
    
            }).catch((err) => {
                if(  err?.status_code == 400 ) {

                    Object.entries(err).forEach(([key, value]: [string, string]) => {
                        if(key !== 'status_code') {
                            Toast.show({type: 'customToast', text1: value})
                        }
                    })

                }
                
                console.log('CATCH UI PROMISE', err )
            }).finally(() => {
                setLoader(false)
            })
        }

    }

    
    // const onChangeEmailHandler = useCallback((option: any) => {
    //     /**
    //      * Validation
    //      */

    //     if (option.type === 'email') {
    //         setEmail(option.text)
    //     }
    //     else if(option.type === 'password') {
    //         setPassword(option.text)
    //     }

    // }, [email, password])

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

                <TouchableOpacity  
                    style={[styles.introBtn, { opacity: isFormValid ? 1 : 0.5, backgroundColor: isFormValid? '#48BB78': 'grey', marginTop: 10 }]} 
                    disabled={!isFormValid || loader}  onPress={onSumbitHandler}> 
                    { loader ? <ActivityIndicator size={'small'} color="#fff" /> :<Text style={styles.buttonText}>{t('screens.signup.title')}</Text>} 
                </TouchableOpacity>

            </View>
        </View>
    )
}



export default SignUp