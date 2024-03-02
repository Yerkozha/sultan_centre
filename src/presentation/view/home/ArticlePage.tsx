import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { HomeProps } from "./types";
import { RootStackParamList, ScreenProps } from "@/navigators/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArticlePageWrapperHOCWrappedAllProps } from "@/presentation/container/HomeContainer";
import { StyleSheet } from "react-native";
import { useAppSelector } from "@/hooks/useStore";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

type RouteParams = NativeStackScreenProps<RootStackParamList, 'ArticlePage'>;
/**
 * 
 * Tape, virtualization, article&research
 */

const styles = StyleSheet.create({
    flatListContainer: {
        backgroundColor: '#ffffff',
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 6,
        padding: 0,
        alignContent: "center",
        justifyContent: "center",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    innerContainer: {
        flexDirection: 'row',
    },

    img: {
        width:100,
        height:100,
        resizeMode:'cover',
        borderRadius: 6,
        marginRight: 10
    },

    textWrapper: {
        flexShrink: 1
    },
    articleTitle: {
        fontWeight: 'bold'
    },

    listHeader: {
        
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        backgroundColor: '#ffffff'
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    }
    
});

const ArticleItem = ({item}) => {

    return (<View style={styles.innerContainer}>
            <Image
                style={styles.img}
                resizeMode="contain"
                source={
                    {
                        uri: item.image
                    }
                }
            />
            <View style={styles.textWrapper}>
                <Text style={styles.articleTitle}>{item.title}</Text>
                <Text numberOfLines={1}>{item.content}</Text>
            </View>
        </View>
    )
}

function ArticlePage({vm, articles, route}: HomeProps & ArticlePageWrapperHOCWrappedAllProps & RouteParams) {
    const { t, i18n } = useTranslation(); //i18n instance
    
    const articlesList = useAppSelector(state => state.articles.articles)
    

    useEffect(() => {
        console.log('initialRender')

        return () => {
        }
    },[])
    
    return (<View>
        <Text>ArticlePage</Text>
        <Text>{route.params.article?.title}</Text>
    </View>)
}


export default ArticlePage
