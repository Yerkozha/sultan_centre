import React, { useCallback, useEffect, useState } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";

import { AuthContainerAllProps } from "@/presentation/container/AuthContainer";
import {AuthProps} from './types'
import { ScreenProps } from "@/navigators/types";
import { useValidate } from "@/hooks/useValidate";
import { styles } from "./style";
import { useAppSelector } from "@/hooks/useStore";

function SignUp({vm, auth, resetError, navigation}: AuthContainerAllProps & AuthProps & ScreenProps ) {
    
    const {errors, email, password, setEmail, setPassword, isFormValid, setIsFormValid, isDirtyFields, setDirtyFields, setErrors} 
        = useValidate(resetError);
    
    function onSumbitHandler() {

        if( isFormValid ) {
            auth({
                type: 'registration',
                email,
                password
            }).unwrap().then(() => {
    
                navigation.navigate('SignIn')
    
            }).catch((err) => {
                console.log('CATCH UI PROMISE', err )
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
            <Text>SignUp</Text> 
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
                <Text>SignUp</Text> 
            </TouchableOpacity> 

            { Object.entries(isDirtyFields).some(([_, value]) => value === true) && Object.values(errors).map((error, index) => ( 
                <Text key={index} style={styles.error}> 
                    {error}
                </Text> 
            ))} 
        </View>
    )
}



export default SignUp