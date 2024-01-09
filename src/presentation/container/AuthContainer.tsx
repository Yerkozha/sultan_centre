import React, {useState} from "react";
import { connect, ConnectedProps  } from 'react-redux'
import SignUp from '@/presentation/view/auth/SignUp'
import SignIn from "@/presentation/view/auth/SignIn";
import { AuthViewModel } from "../view-model/auth/AuthViewModel";
import { auth, resetError } from "@/store/user/user";
import type {ScreenProps} from '@/navigators/types'

const authViewModel = new AuthViewModel()


function AuthContainer(props: AuthContainerAllProps & ScreenProps ) { // hoc connect tac ac

    
    if(props.route.name  === 'SignIn') {
        return <SignIn vm={authViewModel} {...props} ></SignIn> 
    }

    return <SignUp vm={authViewModel} {...props} ></SignUp>
}

const connector = connect(null, {
    auth,
    resetError
})

export type AuthContainerAllProps = ConnectedProps<typeof connector> & {
    
}

export default connector(AuthContainer)