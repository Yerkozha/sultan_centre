import React, { useCallback, useEffect, useRef, useState } from "react";
import { TextInput, View, Pressable, Dimensions } from "react-native";

import { Text} from 'react-native-paper'

import { AuthFlowWrapperHOCAllProps } from "@/presentation/container/AuthContainer";
import { AuthProps } from './types'
import { ScreenProps } from "@/navigators/types";
import { useValidate } from "@/hooks/useValidate";
import { styles } from "./style";
import { useAppSelector } from "@/hooks/useStore";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from "@/services/BottomSheet";
import LanguageSwitcher from "@/services/LanguageSwitcher";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TabActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


function WelcomePage({ vm, auth, resetError, navigation }: AuthFlowWrapperHOCAllProps & AuthProps & ScreenProps) {

  const { t, i18n } = useTranslation()

  function authNavigateHandler() {
    navigation.push('SignIn')
  }

  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState()
  const toggleDarken = (value, language) => {
    setIsVisible(value)
  }

  function languageHandler(){
    ref.current.openBottomSheet()
  }

  function createAccountHandler() {
    navigation.push('SignUp')
  }

  function backActionHandler() {
    navigation.dispatch(TabActions.jumpTo('HomeContainer'))
  }

  return (
    <GestureHandlerRootView style={styles.container}>

      <BottomSheet ref={ref} isVisible={isVisible} toggleDarken={toggleDarken}>
        <LanguageSwitcher toggleDarken={toggleDarken} bottomSheetTab={ref} />
      </BottomSheet>

      <View style={styles.wrapper}>

        <View style={styles.welcomeHeader}>

          <Ionicons name={'arrow-back'} size={28} color={'#000'} onPress={backActionHandler} />

          <Text onPress={languageHandler} style={styles.languageSwitcher}>
            <MaterialIcons name={'language'} size={16} color={'#000'}  />
            <Text style={styles.languageText}>{i18n.language.toLocaleUpperCase()}</Text>
          </Text>

        </View>

        <View style={styles.mainImage}>
          <FastImage source={
            require('../../../assets/sultan_logo-removebg-preview.png')}
            style={{
              width: 175,
              height: 175,
              zIndex: 11
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={[styles.introTitle]}>{t('screens.intro.title')}</Text>
        </View>

          <View style={{gap: 10}}>
            <Pressable
          
              onPress={authNavigateHandler}
              style={styles.introBtn}>
              <Text
                style={styles.introBtnTitle}>
                {t('screens.login.title')}
              </Text>
            </Pressable>

            <Pressable
              onPress={createAccountHandler}
              style={[styles.introBtn, {
                backgroundColor: 'rgba(228,243,240, 1)'
              }]}>
              <Text
                style={[styles.introBtnTitle, {color: '#067e66'}]}>
                {t('screens.login.createAccount')}
              </Text>
            </Pressable>
          </View>
        

        <Text
            style={styles.extraBottomText}>
            {t('screens.intro.text')}
        </Text>

      </View>
    </GestureHandlerRootView>
  )
}



export default WelcomePage