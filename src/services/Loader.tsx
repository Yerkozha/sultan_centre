import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from "react";
import Animated, {FadeOutUp} from 'react-native-reanimated';

export function Loader() {
    return <Animated.View exiting={FadeOutUp} style={{flex: 1, justifyContent: 'center'}}>
       <ActivityIndicator size="large" color="tomato" />
    </Animated.View>  
  }