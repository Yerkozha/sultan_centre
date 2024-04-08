import React ,{ useEffect, useRef, useState, useMemo } from "react";
import { Text, View, Button, TouchableOpacity, SectionList, Dimensions, StyleSheet, StatusBar, } from "react-native";
import { ProfileProps } from "./types";
import { RootStackParamList } from "@/navigators/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileContainerAllProps } from "@/presentation/container/ProfileContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from '@/services/LanguageSwitcher'

import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type ProfileRouteParams = NativeStackScreenProps<RootStackParamList, 'Profile'>;
/**
 * 
 * Settings, auth
 */
import { SettingsListItem } from "./ListItem";
import { SettingsListSectionHeader } from "./ListItemHeader";
import BottomSheet from "@/services/BottomSheet";

export type MenuItem = {
    type: string
    content: string
    extraContent?: string
}



const StyledSearchItemSeparator = () => {
  return (
    <View style={{
      height: 1,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    }} />
  );
};

function Profile({vm, auth}: ProfileProps & ProfileContainerAllProps & ProfileRouteParams) {
    const { t, i18n } = useTranslation(); //i18n instance
    const ref = useRef()
    const [isVisible, setIsVisible] = useState()
    const settingsData = useMemo(() => {
      const settingsData: {
        title: string;
        icon: JSX.Element;
        data: MenuItem[];
        }[] = [
        {
          title: t('screens.settings.setting'),
          icon: (
            <View style={{
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#fff',
            }}>
              <SimpleLineIcons name={'settings'} size={24} color={'grey'} />
            </View>
          ),
          data: [{
            type: 'language',
            content: t('screens.settings.language'),
            extraContent: t('language')
          }, 
          {type: 'qa', content: t('screens.settings.qa')}, 
          {type: 'feedback',content: t('screens.settings.feedback')}, 
          {type: 'shareFriend',content: t('screens.settings.shareFriend')}],
        },
        
      ];
    return settingsData
    }, [i18n.language])
  

   
    
    

    const toggleDarken = (value) => {
      setIsVisible(value)
    }
    
    return (<GestureHandlerRootView style={{  
              flex: 1,  
            }}>
        
        <BottomSheet ref={ref} isVisible={isVisible} toggleDarken={toggleDarken}>
          <LanguageSwitcher toggleDarken={toggleDarken} bottomSheetTab={ref}/>
        </BottomSheet>
            
        <View style={{
            flex: 1,  
            marginHorizontal: 10
        }}>
          <SectionList 
              sections={settingsData}
              style={{ flex: 1, width: '100%', marginTop: 24 }}
              showsVerticalScrollIndicator={false}
              bounces={false}
              onEndReachedThreshold={0.5}
              ItemSeparatorComponent={StyledSearchItemSeparator}
              keyExtractor={(it) => it.type}
              
              renderItem={(props) => {
                console.log(props.item)
                  const isFirstElement = props.index === 0;
                  const isLastElement = props.index === props.section.data.length - 1;
          
                  return (
                    <SettingsListItem
                      item={props.item}
                      isFirstElement={isFirstElement}
                      isLastElement={isLastElement}
                      bottomSheetTab={ref}
                    />
                  );
                }}
              renderSectionHeader={({ section: { title, icon } }) => (
                  <SettingsListSectionHeader icon={icon} title={title} />
                )} 
          />
       </View>
        </GestureHandlerRootView>)
}


export default Profile




// export const SettingsList = () => {
//   return (
//     <RN.SectionList
//       sections={settingsData}
//       style={{ flex: 1, width: '100%', marginTop: 24 }}
//       showsVerticalScrollIndicator={false}
//       bounces={false}
//       onEndReachedThreshold={0.5}
//       ItemSeparatorComponent={StyledSearchItemSeparator}
//       keyExtractor={(it) => it}
//       renderItem={(props) => {
//         const isFirstElement = props.index === 0;
//         const isLastElement = props.index === props.section.data.length - 1;

//         return (
//           <SettingsListItem
//             item={props.item}
//             isFirstElement={isFirstElement}
//             isLastElement={isLastElement}
//           />
//         );
//       }}
//       renderSectionHeader={({ section: { title, icon } }) => (
//         <SettingsListSectionHeader icon={icon} title={title} />
//       )}
//     />
//   );
// };



