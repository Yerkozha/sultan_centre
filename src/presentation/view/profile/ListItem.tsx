import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, ViewStyle, View, TouchableHighlight, Share, Platform, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import { MenuItem } from './Profile';

import Ionicons from 'react-native-vector-icons/AntDesign';

import Toast from 'react-native-toast-message';

interface Props {
  item: MenuItem;
  isFirstElement?: boolean;
  isLastElement?: boolean;
  bottomSheetTab: any
}

interface IStyledSettingsListItemWrapper {
  isFirstElement?: boolean;
  isLastElement?: boolean;
  children: React.ReactNode
  onPress: () => void
  item: any
  bottomSheetTab: any
}

const radius = 15; // Assuming a predefined radius value

const StyledSettingsListItemWrapper: React.FC<IStyledSettingsListItemWrapper> = ({
    isFirstElement,
    isLastElement,
    children,
    item,
    bottomSheetTab,
    onPress
  }) => {

    

  const dynamicStyle: ViewStyle = {
   
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: radius,
    backgroundColor: '#FFF', // Set your theme's listItemBackgroundColor here
    borderTopLeftRadius: isFirstElement ? radius : 0,
    borderTopRightRadius: isFirstElement ? radius : 0,
    borderBottomLeftRadius: isLastElement ? radius : 0,
    borderBottomRightRadius: isLastElement ? radius : 0,
  };

  return (
    <TouchableOpacity style={dynamicStyle} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export const SettingsListItem = (props: Props) => {
  const { t } = useTranslation();

  
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: t('screens.settings.appShare') + "http://195.49.210.112:8000/gotoapp",
      });
      if (result.action === Share.sharedAction) {
        console.log(result)
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const toWhatsApp = async () => {

    const phoneWithCountryCode = "77759152614";
    const number = Platform.OS == "ios" ? phoneWithCountryCode : "+" + phoneWithCountryCode;

    let url = "whatsapp://send?text=" + t('screens.settings.appShare') + "&phone=" + number;
    try {
      const data = await Linking.openURL(url); // true
    } catch {
      Toast.show({type: 'error', text1: "Try again later"})
    }
  }
  
  function optionHandler() {
    
    switch( props.item.type ) {
      case 'language':
        props.bottomSheetTab.current.openBottomSheet()
        break;
      case 'feedback':
        toWhatsApp()
        break;
      case 'qa':
        console.log('QA pressed')
        break;
      case 'shareFriend':
        onShare()
        break;
      default:
        console.log('settings none matched!')
    }
  
  }


  return (
    <StyledSettingsListItemWrapper
      {...props}
      item={props.item}
      isFirstElement={props.isFirstElement}
      isLastElement={props.isLastElement}
      onPress={optionHandler}>
      
          <Text numberOfLines={1}>
            {props.item.content}
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection:'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 10
            }}>
              {props.item.extraContent && (<Text style={{fontSize: 12}}>{props.item.extraContent}</Text>)}
              <Ionicons name={'right'} size={12} color={'grey'} />
          </View>
      
    </StyledSettingsListItemWrapper>
  );
};

