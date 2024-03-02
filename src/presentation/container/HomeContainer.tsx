import React, { useEffect } from 'react'
import Articles from '@/presentation/view/home/Articles'
import ArticlePage from '@/presentation/view/home/ArticlePage'
import {HomeViewModel} from '@/presentation/view-model/home/HomeViewModel'
import { ConnectedProps, connect } from 'react-redux'
import { articles, resetArticles } from '@/store/articles/articles'
import { RootStackParamList, ScreenProps } from '@/navigators/types'
import { createNativeStackNavigator } from '@react-navigation/native-stack'


const homeViewModel = new HomeViewModel()

function ArticlesWrapper (props) {
    console.log('PROPS', props)

    useEffect(() => {
        console.log('HOME IS MOUNTED!')
        return () => {
            console.log('HOME IS UNMOUNTEDS!')
        }
    })


    return <Articles {...props} vm={homeViewModel}></Articles>
}

const connector = connect(null, {
    articles,
    resetArticles
})

export type ArticlesHOCWrappedAllProps = ConnectedProps<typeof connector> & {
    
}

const ArticlesHOCWrapped =  connector(ArticlesWrapper)

/**
 * 
 * ==== SECOND PAGE ====
 * 
 */


function ArticlePageWrapper (props) {
    console.log('PROPS', props)

    useEffect(() => {
        console.log('HOME IS MOUNTED!')
        return () => {
            console.log('HOME IS UNMOUNTEDS!')
        }
    })


    return <ArticlePage {...props} vm={homeViewModel}></ArticlePage>
}

const articleConnector = connect(null, {
    articles,
    resetArticles
})

export type ArticlePageWrapperHOCWrappedAllProps = ConnectedProps<typeof articleConnector> & {
    
}

const ArticlePageWrapperHOCWrapped =  articleConnector(ArticlePageWrapper)

// ====================

const Stack = createNativeStackNavigator<RootStackParamList>();

export function HomeContainer({ route, navigation }: ScreenProps) {

    return (
        <Stack.Navigator initialRouteName="Articles" screenOptions={{
            headerShown: false
        }}>
          <Stack.Screen 
              name="ArticlePage" 
              component={ArticlePageWrapperHOCWrapped} 
             
            />
          <Stack.Screen 
              name="Articles" 
              component={ArticlesHOCWrapped} 
              
            />
          
        </Stack.Navigator>
    )
  }