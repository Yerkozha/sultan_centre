import { View } from 'react-native'
import {Text} from 'react-native-paper'

export function ErrorFeedback(props) {
  console.log(props)
  return (<View style={{
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    width: "80%",
    height: 50,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <Text style={{
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        color: '#fff'
    }}>{props.text1}</Text>
  </View>)
}