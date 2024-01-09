import React from 'react'
import {connect, ConnectedProps} from 'react-redux'
import Profile, { ProfileRouteParams } from '@/presentation/view/profile/Profile'
import {ProfileViewModel} from '@/presentation/view-model/profile/ProfileViewModel'
import { auth, resetError } from '@/store/user/user'


const profileViewModel = new ProfileViewModel()

function ProfileContainer (props: ProfileContainerAllProps & ProfileRouteParams) {


    return <Profile {...props} vm={profileViewModel}></Profile>
}

const connector = connect(null, {
    auth,
    resetError
})

export type ProfileContainerAllProps = ConnectedProps<typeof connector> & {
    
}

export default connector(ProfileContainer)