import React, { useCallback, useEffect, useState } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";

import { AuthContainerAllProps } from "@/presentation/container/AuthContainer";
import {AuthProps} from './types'
import { ScreenProps } from "@/navigators/types";
import { useAppSelector } from "@/hooks/useStore";
import { useValidate } from "@/hooks/useValidate";
import { styles } from "./style";
import AsyncStorage from "@react-native-async-storage/async-storage";


function SignIn({vm, auth, resetError}: AuthContainerAllProps & AuthProps & ScreenProps ) {
    
    const user = useAppSelector(state => state.user)

    const {errors, email, password, setEmail, setPassword, isFormValid, setIsFormValid, isDirtyFields, setDirtyFields} = useValidate(resetError)
    
    useEffect(() => {
        
        if( user.authenticatedUser?.email ) {
            setEmail(user.authenticatedUser?.email)
            setPassword(user.password)
            setIsFormValid(true)
        }

    }, [])

    function onSumbitHandler() {

        if( isFormValid ) {
            auth({
                type: 'login',
                email,
                password
            }).unwrap().then(async(data) => {
                console.log('LOGIN',data)
                console.log('RR',data['refresh'])
                await AsyncStorage.setItem('access', data['access'])
                await AsyncStorage.setItem('refresh', data['refresh'])
            })
        }   
    }

    return (
        <View style={styles.container}>
            <Text>SignIn</Text> 
            <TextInput 
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => {
                    setDirtyFields((s) => ({...s, email: true}))
                    setEmail(text)}}
                value={email}
                
             />
            <TextInput 
                style={styles.input}
                placeholder="Password"
                onChangeText={(text) => {
                    setDirtyFields((s) => ({...s, password: true}))
                    setPassword(text)}}
                value={password}
                secureTextEntry
                
             />

            <TouchableOpacity  
                style={[styles.button, { opacity: isFormValid ? 1 : 0.5 }]} 
                disabled={!isFormValid}  onPress={onSumbitHandler}> 
                <Text>SignIn</Text> 
            </TouchableOpacity>

            {Object.entries(isDirtyFields).some(([_, value]) => value === true) && Object.values(errors).map((error, index) => ( 
                <Text key={index} style={styles.error}> 
                    {error}
                </Text> 
            ))} 
        </View>
    )
}

export default SignIn