import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { HomeProps } from "./types";
import { RootStackParamList, ScreenProps } from "@/navigators/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArticlesHOCWrappedAllProps } from "@/presentation/container/HomeContainer";
import { StyleSheet } from "react-native";
import { useAppSelector } from "@/hooks/useStore";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";

type RouteParams = NativeStackScreenProps<RootStackParamList, 'Articles'>;
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
            <FastImage
                style={styles.img}
                source={{
                    uri: item.image
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.textWrapper}>
                <Text style={styles.articleTitle}>{item.title}</Text>
                <Text numberOfLines={1}>{item.content}</Text>
            </View>
        </View>
    )
}

function Articles({vm, articles, navigation}: HomeProps & ArticlesHOCWrappedAllProps & RouteParams) {
    const { t, i18n } = useTranslation(); //i18n instance
    let [forceUpdate, setForceUpdate] = useState(0)
    let [refreshing, setRefreshing] = useState(false)
    const articlesList = useAppSelector(state => state.articles.articles)
    
    

    useEffect(() => {
        console.log('insidearticlesList', articlesList)
        articles({type: 'getList'}).unwrap()
            .then((res) => {
                console.log('res', res)
                // CHECK ( cause infinite rerender and request device app )
            })


        return () => {
        }
    },[i18n.language])

    const renderItem = ({item, separators}) => {

            return (<TouchableOpacity  
                    style={styles.flatListContainer}
                    key={item.id}
                    onPress={() => onSelectArticle(item)}
                >
                <ArticleItem
                        item={item}
                ></ArticleItem>
            </TouchableOpacity  >)
    }
    const ListHeaderComponent = () => {

        return (<View>
            <Text style={styles.headerTitle}>
           { t("screens.articles.header")}
        </Text>
        </View> )
    }
    const keyExtractor = item => item.id.toString()

    function onSelectArticle(item) {

        console.log('ITEM', item)

        navigation.navigate('ArticlePage', {
            article: item
        })
    }   

    function onRefreshHandler() {
        console.log('ON REFRESH CALLED')
    }
    
    return (<View>
         <FlatList
            data={articlesList}
            ListHeaderComponent={<ListHeaderComponent />}
            ListHeaderComponentStyle={styles.listHeader}
            stickyHeaderIndices={[0]}
            renderItem={renderItem}
            keyExtractor={keyExtractor} 
            extraData={forceUpdate}
            refreshing={refreshing}
            onRefresh={onRefreshHandler}
            progressViewOffset={10}
        />
    </View>)
}


export default Articles
