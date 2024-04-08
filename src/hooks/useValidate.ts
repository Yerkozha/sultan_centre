import React, {useEffect, useState} from 'react'
import { useAppSelector } from './useStore'
import Toast from 'react-native-toast-message';
import { isObject } from '@/utils';

type FormErrors = {
    email?: string
    password?: string
}

export const useValidate = (resetError) => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [errors, setErrors] = useState<Record<string,string>>({}); 
    const [isFormValid, setIsFormValid] = useState(false); 
    const [isDirtyFields, setDirtyFields] = useState({email: false, password: false})
  
    const user = useAppSelector(state => state.user)

    useEffect(() => { 
    
        validateForm(); 
    }, [ email, password]); 
  
    const validateForm = () => { 
        let errors: FormErrors = {}; 
  
        if (!email) { 
            errors.email = 'Email is required.'; 

        } else if (!/\S+@\S+\.\S+/.test(email)) {

            errors.email = 'Email is invalid.'; 

        } 
  
        if (!password) { 
            errors.password = 'Password is required.'; 

        } else if (password.length < 4) { 

            errors.password = 'Password must be at least 6 characters.'; 

        } 

        setErrors(errors); 
        setIsFormValid(Object.keys(errors).length === 0); 
    }; 

    useEffect(() => { 

        if( user.error.length ) {
            user.error.forEach((error) => {
                Object.entries(error).forEach(([_,value]: [string,string]) => {
                    
                    if( _ !== 'status_code' && !isObject(value) ) {
                        Toast.show({type: 'customToast', text1: value as string})
                        setDirtyFields((s) => ({...s, _: true}))
                        setErrors({_: value})
                    }

                })
            }) 
            
            resetError()
        }
        
    }, [user.error])
  
    return {
        email, setEmail,
        password, setPassword,
        errors,setErrors,
        isFormValid, setIsFormValid,
        isDirtyFields, setDirtyFields
    }
}