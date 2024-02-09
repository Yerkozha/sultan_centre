import { RootState } from '@/store';
import { hideRootError } from '@/store/user/user';
import React, {Component, ReactNode} from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { ConnectedProps, connect } from 'react-redux';

interface PropsType { children?: ReactNode };
interface State {
  hasError: boolean;
  errorMessage?: string;
}

const connector = connect((state: RootState) => ({
  rootError: state.user.rootError
}), {hideRootError})

export type ErrorBoundaryProps = ConnectedProps<typeof connector> & PropsType

class ErrorBoundary extends Component<ErrorBoundaryProps,State> {
  constructor(props) {
    super(props);

    this.feedBackHandler = this.feedBackHandler.bind(this);
  }

  state = {
    hasError: false
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
    this.props.hideRootError()
  }

  render(): React.ReactNode {

    if (this.state.hasError || this.props.rootError) {

      return (
        <View>
          <Text>Something went wrong</Text>
          <TouchableOpacity  
                style={[styles.button]} 
                onPress={this.feedBackHandler}> 
                <Text>Try again</Text> 
            </TouchableOpacity>
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
  button: { 
    backgroundColor: 'green', 
    borderRadius: 8, 
    paddingVertical: 10, 
    alignItems: 'center', 
    marginTop: 16, 
    marginBottom: 12, 
  }, 
})

export default connector(ErrorBoundary)