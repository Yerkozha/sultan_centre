import React, { useEffect } from 'react'
import Home from '@/presentation/view/home/Home'
import {HomeViewModel} from '@/presentation/view-model/home/HomeViewModel'

const homeViewModel = new HomeViewModel()

export function HomeContainer (props) {

    useEffect(() => {
        console.log('HOME IS MOUNTED!')
        return () => {
            console.log('HOME IS UNMOUNTEDS!')
        }
    })
    return <Home vm={homeViewModel}></Home>
}