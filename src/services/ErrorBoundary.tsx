import React, {Component, ReactNode} from 'react'
import { Text, View } from 'react-native';

interface PropsType { children?: ReactNode };
interface State {
  hasError: boolean;
  errorMessage?: string;
}

export class ErrorBoundary extends Component<PropsType,State> {
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
  
    render(): React.ReactNode {
      if (this.state.hasError) {
        return (
          <View>
            <Text>Something went wrong</Text>
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