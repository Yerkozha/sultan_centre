import React, { useEffect, useState } from "react";
import { HomeProps } from "./types";
import { RootStackParamList, ScreenProps } from "@/navigators/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArticlePageWrapperHOCWrappedAllProps } from "@/presentation/container/HomeContainer";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { BackHandler, Platform, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

import {
  Dimensions,
  LayoutChangeEvent,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradientRN from 'react-native-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import Svg, {Path, Circle, Rect, Stop, Defs, LinearGradient} from 'react-native-svg';
import { Article } from "@/store/articles/articles";
import { StackActions, TabActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";



type RouteParams = NativeStackScreenProps<RootStackParamList, 'ArticlePage'>;
/**
 * 
 * Tape, virtualization, article&research
 */

const ChevronLeft = () => {
    const navigation = useNavigation()

    function backHandler() {
        navigation.goBack()
    }
    return (
      <Svg
        onPress={backHandler}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        width={24}
        height={24}>
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </Svg>
    );
  };

const EllipsisVertical = () => {
    return (
      <Svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        width={24}
        height={24}>
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
        />
      </Svg>
    );
};

const EllipsisHorizontal = () => {
return (
    <Svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="white"
        width={24}
        height={24}>
        <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
    </Svg>
);
};

const formatter = Intl.NumberFormat('en-IN');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradientRN);

const posterSize = Dimensions.get('screen').height / 2;
const headerTop = 44 - 16;
type AnimationProps = {
  sv: SharedValue<number>;
  article: Article
};

const ScreenHeader: React.FC<AnimationProps> = ({sv, article}) => {
  const inset = useSafeAreaInsets();
  // @ts-ignore
  const opacityAnim = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        sv.value,
        [
          ((posterSize - (headerTop + inset.top)) / 4) * 3,
          posterSize - (headerTop + inset.top) + 1,
        ],
        [0, 1],
      ),
      transform: [
        {
          scale: interpolate(
            sv.value,
            [
              ((posterSize - (headerTop + inset.top)) / 4) * 3,
              posterSize - (headerTop + inset.top) + 1,
            ],
            [0.98, 1],
            Extrapolation.CLAMP,
          ),
        },
        {
          translateY: interpolate(
            sv.value,
            [
              ((posterSize - (headerTop + inset.top)) / 4) * 3,
              posterSize - (headerTop + inset.top) + 1,
            ],
            [-10, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
      paddingTop: inset.top === 0 ? 8 : inset.top,
    };
  });
  return (
    <Animated.View
      style={[
        {
            position: 'absolute',
            width: '100%',
            paddingHorizontal: 16, // Tailwind's spacing scale is typically 4px per unit, so px-4 would translate to 16px
            paddingBottom: 8, // pb-2 translates to 8px
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            zIndex: 10,
            backgroundColor: '#000', // bg-black translates to a black background
          },
        opacityAnim,
      ]}>
      <ChevronLeft />
      <Animated.Text numberOfLines={1} style={{
            fontSize: 20, // Equivalent to text-xl in Tailwind
            color: '#FFFFFF', // Equivalent to text-white
            fontWeight: '500', // Equivalent to font-medium; adjust as needed based on your font
        }}>
        {article.title}
      </Animated.Text>
    </Animated.View>
  );
};

const PosterImage: React.FC<AnimationProps> = ({sv, article}) => {
  const inset = useSafeAreaInsets();
  const layoutY = useSharedValue(0);
  const opacityAnim = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        sv.value,
        [0, posterSize - (headerTop + inset.top) / 0.9],
        [1, 0],
        Extrapolation.CLAMP,
      ),
    };
  });
  // @ts-ignore
  const textAnim = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        sv.value,
        [-posterSize / 8, 0, posterSize - (headerTop + inset.top) / 0.8],
        [0, 1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            sv.value,
            [-posterSize / 8, 0, (posterSize - (headerTop + inset.top)) / 2],
            [1.1, 1, 0.95],
            'clamp',
          ),
        },
        {
          translateY: interpolate(
            sv.value,
            [layoutY.value - 1, layoutY.value, layoutY.value + 1],
            [0, 0, -1],
          ),
        },
      ],
    };
  });
  const scaleAnim = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(sv.value, [-50, 0], [1.3, 1], {
            extrapolateLeft: 'extend',
            extrapolateRight: 'clamp',
          }),
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.imageContainer, opacityAnim]}>
      <Animated.Image
        style={[styles.imageStyle, scaleAnim]}
        source={{
            uri: article.image
        }}
      />
      <Animated.View
        onLayout={(event: LayoutChangeEvent) => {
          'worklet';
          layoutY.value = event.nativeEvent.layout.y;
        }}
        style={[
            {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: 'flex-end', // Equivalent to justify-end in a column layout
                alignItems: 'center', // Equivalent to items-center
                paddingHorizontal: 20, // Equivalent to px-5 (assuming 1 unit = 4px)
                zIndex: 10, // Equivalent to z-10
              },
          textAnim,
        ]}>
        <Animated.Text
          numberOfLines={2}
          style={{
            fontSize: 64, // Equivalent to text-6xl in Tailwind
            fontWeight: 'bold', // Equivalent to font-bold
            color: '#FFFFFF', // Equivalent to text-white
            textAlign: 'center', // Equivalent to text-center
          }}>
          {article.title}
        </Animated.Text>
      </Animated.View>
      <AnimatedLinearGradient
        style={[{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }, scaleAnim]}
        colors={[
          `rgba(0,0,0,${0})`,
          `rgba(0,0,0,${0.1})`,
          `rgba(0,0,0,${0.3})`,
          `rgba(0,0,0,${0.5})`,
          `rgba(0,0,0,${0.8})`,
          `rgba(0,0,0,${1})`,
        ]}
      />
    </Animated.View>
  );
};

const ArticleDescription = ({article}) => {
    const id = Number(article.id)
  return (
    <View style={{
        backgroundColor: '#000000'
    }}>
        <Svg width="100%" height="100%" style={{position: 'absolute' ,}}>
            <Defs>
            <LinearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#060608" />
                {
                    id % 2 === 0 ? <Stop offset="60%" stopColor="#0d2710" /> : id % 3 === 0 ? <Stop offset="60%" stopColor="rgba(42,32,12,1)" /> :  <Stop offset="60%" stopColor="rgba(13,26,44,1)" />
                }
                <Stop offset="100%" stopColor="#000000" />
            </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad1)" />
        </Svg>
        <View
            style={{
                flex: 1, // Equivalent to 'flex'
                flexDirection: 'row', // Equivalent to 'flex-row'
                alignItems: 'center', // Equivalent to 'items-center'
                justifyContent: 'space-between', // Equivalent to 'justify-between'
                paddingVertical: 8, // Equivalent to 'py-2'
                marginRight: 20, // Equivalent to 'mr-5'
              }}
            >
            <View style={{
                        flex: 1, // Equivalent to 'flex'
                        flexDirection: 'column', // Equivalent to 'flex-row'
                        alignItems: 'center', // Equivalent to 'items-center'
                    }}>
                
                <ScrollView style={{ flexGrow: 0.4, paddingLeft: 40 }}>
                    <Text
                        style={{
                            fontSize: 16, // Equivalent to text-base in Tailwind CSS
                            fontWeight: '500', // Equivalent to font-medium; adjust as needed based on your font
                            color: '#8d8d8d', // Equivalent to text-white
                            zIndex: 2,
                            fontFamily: 'GolosText-Regular'
                        }}>
                        {article.content}
                    </Text>
                    
                    <Text style={{
                        fontSize: 14, // Equivalent to text-sm in Tailwind
                        color: 'rgba(255, 255, 255, 0.6)', // Equivalent to text-white with opacity-60
                    }}>
                        {formatter.format(89740943)}
                    </Text>
                    
                </ScrollView>
            </View>
        </View>
      
    </View>
  );
};

function ArticlePage({vm, articles, route, navigation}: HomeProps & ArticlePageWrapperHOCWrappedAllProps & RouteParams) {
    const dispatch = useAppDispatch()
    const { t, i18n } = useTranslation(); //i18n instance
    const accessToken = useAppSelector((state) => state.user.access)
  const inset = useSafeAreaInsets();
  const sv = useSharedValue<number>(0);

  useFocusEffect(() => {
    if (Platform.OS === "ios") {       enableScreens(false);     } // CHECK
  })
  
  useEffect(() => {
    function backHandler () {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
            display: "flex",
        },
        tabBarVisible: undefined
      });
      StatusBar.setHidden(false)
      return false
    }

    const unsubsribe = navigation.addListener('blur', () => {
      console.log('BLUR')
      backHandler()

    });

    const backSubscribtion = BackHandler.addEventListener('hardwareBackPress', backHandler)
    
    console.log('CCC')
    navigation.getParent()?.setOptions({
        tabBarStyle: {
            display: "none"
        },
        tabBarVisible: false
    });

    StatusBar.setHidden(true) // CHECK changing to event

    return () => {
      backSubscribtion.remove()
      unsubsribe()
    }

    },[navigation]) // CHECK SHOULD NOT UN MOUNT ? STACK << TAB useFocusEffect ?!
    
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      'worklet';
      sv.value = event.contentOffset.y;
    },
  });
  console.log('sv', sv)
    console.log('scrollHandler', scrollHandler)

  const initialTranslateValue = posterSize;

  const animatedScrollStyle = useAnimatedStyle(() => {
    return {
      paddingTop: initialTranslateValue,
    };
  });

  const layoutY = useSharedValue(0);

  const stickyElement = useAnimatedStyle(() => {
    return {
      backgroundColor: 'black',
      transform: [
        {
          translateY: interpolate(
            sv.value,
            [
              layoutY.value - (headerTop + inset.top) - 1,
              layoutY.value - (headerTop + inset.top),
              layoutY.value - (headerTop + inset.top) + 1,
            ],
            [0, 0, 1],
          ),
        },
      ],
    };
  });
  function headerBtnHandler() {
    navigation.dispatch(TabActions.jumpTo('AppointmentStackNavigator'))
  }
  return (
    <Animated.View style={[{
        flex: 1,
        backgroundColor: '#000'
      }]}>
      <ScreenHeader sv={sv} article={route.params.article} />
      <PosterImage sv={sv} article={route.params.article} />
      
      <Animated.View style={{
                    flex: 1,
                }}>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          style={{
                flex: 1,
            }}
          showsVerticalScrollIndicator={false}>
          <Animated.View style={[animatedScrollStyle, {
                    paddingBottom: 40, // Equivalent to pb-10 in Tailwind CSS
                }]}>
            {/* Button Section */}
            <Animated.View
              onLayout={(event: LayoutChangeEvent) => {
                'worklet';
                layoutY.value = event.nativeEvent.layout.y;
              }}
              style={[
                {
                    flex: 1, // Equivalent to 'flex'
                    alignItems: 'center', // Equivalent to 'items-center'
                    justifyContent: 'center', // Equivalent to 'justify-center'
                    zIndex: 10, // Equivalent to 'z-10'
                    paddingBottom: 16, // Equivalent to 'pb-4'
                    paddingTop: 16, // Equivalent to 'pt-4'
                  },
                stickyElement,
              ]}>
              <Pressable
                onPress={headerBtnHandler}
                style={{
                    backgroundColor: '#48BB78', // A generic green color, adjust as needed for bg-green-500
                    paddingHorizontal: 40, // Equivalent to px-10
                    paddingVertical: 8, // Equivalent to py-2
                    alignItems: 'center', // Equivalent to items-center
                    borderRadius: 9999, // Equivalent to rounded-full
                  }}>
                <Text
                  style={{
                    fontSize: 16, // Equivalent to text-base in Tailwind CSS
                    fontWeight: 'bold', // Equivalent to font-bold
                    color: '#FFFFFF', // Equivalent to text-white
                    textTransform: 'uppercase', // Equivalent to uppercase
                  }}>
                  {t('screens.articles.btn')}
                </Text>
              </Pressable>
            </Animated.View>
            <Animated.View
              style={{
                flex: 1, // Equivalent to 'flex'
                alignItems: 'flex-start', // Equivalent to 'items-start'
                justifyContent: 'center', // Equivalent to 'justify-center'
                paddingBottom: 12, // Equivalent to 'pb-3'
                paddingTop: 16, // Equivalent to 'pt-4'
                backgroundColor: '#000000', // Equivalent to 'bg-black'
              }}>
              <Pressable
                style={{
                    paddingHorizontal: 40, // Equivalent to px-10
                    alignItems: 'flex-start', // Equivalent to items-start for flex containers
                    borderRadius: 9999, // A large value for borderRadius to achieve the rounded-full effect
                  }}>
                <Text
                  style={{
                    fontSize: 18, // Equivalent to text-[18px]
                    letterSpacing: 0.15, // Approximation for tracking-[.15]; adjust as needed
                    fontWeight: 'bold', // Equivalent to font-bold
                    color: '#FFFFFF', // Equivalent to text-white
                  }}>
                  {route.params.article.title}
                </Text>
              </Pressable>
            </Animated.View>
            
            <ArticleDescription article={route.params.article} />
          </Animated.View>
        </Animated.ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    imageContainer: {
      height: Dimensions.get('screen').height / 2,
      width: Dimensions.get('screen').width,
      position: 'absolute',
    },
    imageStyle: {
      height: '100%',
      width: '100%',
      resizeMode: 'cover',
    },
  });

export default ArticlePage
