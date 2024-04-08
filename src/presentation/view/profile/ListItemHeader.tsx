import React from 'react'
import {View, Text} from 'react-native';

interface Props {
  icon: JSX.Element;
  title: string;
}
const StyledSectionWrapper = ({ children }) => {
    return (
      <View style={{
        marginTop: 32,
        marginBottom: 24,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        {children}
      </View>
    );
  };

export const SettingsListSectionHeader = (props: Props) => {
  const { icon, title } = props;
  return (
    <StyledSectionWrapper>
      
      {icon}

      <Text style={{ marginLeft: 16 }}>
        {title}
      </Text>
    </StyledSectionWrapper>
  );
};