import { RootState } from '@/store';
import { hideRootError, feedback } from '@/store/user/user';
import React, {Component, ReactNode} from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { ConnectedProps, connect } from 'react-redux';
import { TextInput } from 'react-native';
import i18n from '@/i18n/i18n';
import { ActivityIndicator } from 'react-native-paper';
import { Appbar } from 'react-native-paper';

interface PropsType { children?: ReactNode };
interface State {
  hasError: boolean;
  errorMessage?: string;
}

const connector = connect((state: RootState) => ({
  rootError: state.user.rootError
}), {hideRootError, feedback})

export type ErrorBoundaryProps = ConnectedProps<typeof connector> & PropsType

class ErrorBoundary extends Component<ErrorBoundaryProps,State> {
  constructor(props) {
    super(props);

    this.feedBackHandler = this.feedBackHandler.bind(this);
    this.onChangeTextHandler = this.onChangeTextHandler.bind(this);
    this.backAction = this.backAction.bind(this);
  }

  state = {
    hasError: false,
    feedbackMessage: null,
    loader: false
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
      /**
       * gather error service
       */
      console.log('DID CATCH', error, errorInfo)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  feedBackHandler() {
    this.setState((prevState) => ({...prevState, loader: true}))
    this.props.feedback(this.state.feedbackMessage)
      .unwrap().then((res) => {
        console.log('res', res)
      }).catch((err) => {

      }).finally(() => {
        this.setState((prevState) => ({...prevState, loader: false, feedbackMessage: null, hasError: false}))
        this.props.hideRootError()
      })
  }

  backAction(){
    this.setState({ hasError: false })
    this.props.hideRootError()
  }
  
  onChangeTextHandler(text){
    this.setState((prevState) => ({...prevState, feedbackMessage: text}))
  }

  render(): React.ReactNode {

    if (this.state.hasError || this.props.rootError) {

      return (
        <View style={styles.container}>
          <Appbar.Header style={{backgroundColor: '#fff'}}>
            <Appbar.BackAction onPress={this.backAction} />
          </Appbar.Header>
          <View style={styles.innerWrapper}>


          <Text style={styles.title}>Oops!</Text>

          <View style={styles.inputWrapper}>
            <TextInput 
              numberOfLines={4}
              multiline={true}
              returnKeyType={'next'}
              style={styles.input}
              placeholder={i18n.t('screens.feedback.placeholder')}
              onChangeText={this.onChangeTextHandler}
              value={this.state.feedbackMessage}
              textAlignVertical='top'
              
            />
          </View>

          <TouchableOpacity  
              style={[styles.button]} 
              onPress={this.feedBackHandler}> 
              {this.state.loader ? <ActivityIndicator size={'small'} color="#fff" /> :<Text style={styles.btnText}>{i18n.t('screens.feedback.btnText')}</Text>}
          </TouchableOpacity>
          </View>
        </View>
      )

    }

    return (
      <>
        {this.props.children}
      </>
    )
  }
  
}

const styles = StyleSheet.create({ 
  title: {
    fontFamily: 'GolosText-Black',
    fontSize: 32,
    padding: 22,
    textAlign: 'center',
    letterSpacing: 4,
    textShadowColor: '#aba9a9',
    textShadowOffset: {
      width: 12,
      height: 18
    },
    textShadowRadius: 22
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between'
  },
  innerWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'space-around'

  },
  inputWrapper: {

  },
  input: { 
    height: 120,
    marginBottom: 12, 
    paddingHorizontal: 10, 
    fontSize: 16, 
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 4,
    
  }, 
  button: { 
    backgroundColor: 'rgba(228,243,240, 1)',
    paddingHorizontal: 40, // Equivalent to px-10
    paddingVertical: 12, // Equivalent to py-2
    alignItems: 'center', // Equivalent to items-center
    borderRadius: 16, // Equivalent to rounded-full
  }, 
  btnText: {
    fontSize: 18,
    color: '#067e66',
    fontFamily: 'Roboto-Bold'
  }
})

export default connector(ErrorBoundary)