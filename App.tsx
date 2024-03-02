import 'react-native-gesture-handler';
import React, { useEffect } from "react";

import AppNavigators from '@/navigators/Application.tsx';
import { FirebaseMessageHandlers } from "./src/services/PushNotificationController.ts";
import { Provider } from 'react-redux';
import { persistor, store } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import ErrorBoundary from '@/services/ErrorBoundary.tsx';

import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import BootSplash from "react-native-bootsplash";

import '@/i18n'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'royalblue',
    
    background: 'white',
  },
};
/**
 * NOTIFICATION SYSTEM
 * HOME PAGE PHOTO
 * LOGO
 * UX/UI LOGIN && PROFILE
 * RELEASE
 * 
 * different db, changing url of db!!!
 */

/**
 * 
 * TASKS SMS login, email
 * fix calendar crud, use materials design theme and other components, 
 * react native firebase token model save
 * chat 
 * photo
 * PRACTICE HARD
 */

/**
 * MUST REVIEW ERRORS
 * 
 * try again in error page <> articles fetching loop
 * 
 * fastImage
 * camera
 * map
 * 
 */




function App(): React.JSX.Element {
  
  
  useEffect(() => {

    FirebaseMessageHandlers.requestUserPermission();
    const unsubscribers = FirebaseMessageHandlers.initializeRemoteMessageHandlers();

    const init = async () => {

    }
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });

    return () => {
      if(unsubscribers.length) {
        unsubscribers.forEach((unsubscriber) => unsubscriber())
      }
    }
  }, []);

  return (
      <>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <PaperProvider theme={theme}>
              <ErrorBoundary>
                <AppNavigators />
                <Toast 
                  visibilityTime={4000}
                />
              </ErrorBoundary>
            </PaperProvider>
          </PersistGate>
        </Provider>
      </>
  )
}

export default App;


/**
 * Backend practice async, eventEmitter
 * 
 * fetch parseError, icon push notification, foreground notification, login error
 * 
 * Video, Image work => stream optimize
 * 
 * AbortControler to abort request actions when fast jumping pages !!!
 */