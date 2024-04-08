
import React, { useEffect } from 'react';
import { GestureHandlerRootView , Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated ,{ useAnimatedStyle, useSharedValue, withSpring, runOnJS  }  from 'react-native-reanimated';

import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';


interface InBottomSheetProps {
    isVisible: boolean
    toggleDarken: (value: boolean, language?: string) => void
    children: React.ReactNode
    
}

const {height: SCREEN_HEIGHT } = Dimensions.get('window')
const MAX_TRANSLATE_Y = SCREEN_HEIGHT / 2
const MIN_TRANSLATE_Y = SCREEN_HEIGHT / 3


export default forwardRef (function BottomSheet({isVisible, toggleDarken, children}: InBottomSheetProps, ref) {

    const translateY = useSharedValue(0)
    const context = useSharedValue({y: 0})
    const navigation = useNavigation()
   

    const gesture = Gesture.Pan()
        .onStart(e => {
            context.value = {y: translateY.value}
        })
        .onUpdate(e => {
            translateY.value = e.translationY + context.value.y;
            translateY.value = Math.max(translateY.value, -MAX_TRANSLATE_Y)
        })
        .onEnd(e => {
            if(translateY.value > -MIN_TRANSLATE_Y){
                 translateY.value = withSpring(SCREEN_HEIGHT);
                 runOnJS(toggleDarken)(false)
            }
            if(translateY.value < -MIN_TRANSLATE_Y){
                translateY.value = withSpring(-MAX_TRANSLATE_Y)
            }
        })

   
    /**
     * Animated style for the bottom sheet
     */
    const reanimatedBottomStyle = useAnimatedStyle( () => {
        return {
            transform: [ {translateY: translateY.value} ]
        }
    })
    
    /**
     * Scrolls to a specific destination
     * @param {number} destination - The destination to scroll to
     */
    const scrollTo = ( destination ) => {
        'worklet'
        translateY.value = withSpring(destination, {damping: 50});
        // navigation.setOptions({
        //     tabBarStyle: {
        //         display: "none"
        //     },
        //     tabBarVisible: false
        // });
    }

   
    useImperativeHandle(ref, () => ({

        openBottomSheet() {
            scrollTo(-SCREEN_HEIGHT / 2)
            toggleDarken(true)
        },
        closeBottomSheet
    
    }));


    function closeBottomSheet() {
        translateY.value = withSpring(SCREEN_HEIGHT)
        toggleDarken(false)
    }
      
  return (
    <>
    {isVisible && (<TouchableOpacity style={styles.backdrop} onPress={closeBottomSheet} activeOpacity={1} />)}

    <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomsheet_container, reanimatedBottomStyle]}>
            <View style={styles.line} />
            {children}
        </Animated.View>
    </GestureDetector>
    </>
  )
})


const styles = StyleSheet.create({
    bottomsheet_container: {
        width: '100%',
        height: SCREEN_HEIGHT,
        backgroundColor: "#fff",
        position: 'absolute',
        top: SCREEN_HEIGHT,
        zIndex: 12000,
        borderRadius: 25,
        paddingHorizontal: 10
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: '#000',
        borderRadius: 20,
        alignSelf: 'center',
        marginVertical: 10,
    },
    backdrop: {
        position: 'absolute',
        width: '100%',
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 11000, // Ensure it's below the BottomSheet but above other content
    },
})