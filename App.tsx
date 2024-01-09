import 'react-native-gesture-handler';
import React, { useEffect } from "react";
import notifee from '@notifee/react-native';

import {AppNavigators} from '@/navigators/Application.tsx';
import { NotificationListener, requestUserPermission } from "./src/services/PushNotificationController.ts";
import { Provider } from 'react-redux';
import { persistor, store } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { ErrorBoundary } from '@/services/ErrorBoundary.tsx';

function App(): React.JSX.Element {
  
  
  useEffect(() => {
    requestUserPermission()
    NotificationListener()
  }, [])

  return (
      <>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <ErrorBoundary>
              <AppNavigators />
              <Toast 
                visibilityTime={4000}
              />
            </ErrorBoundary>
          </PersistGate>
        </Provider>
      </>
  )
}

export default App;

//   // return (
//   //   <SafeAreaView style={backgroundStyle}>
//   //     <StatusBar
//   //       barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//   //       backgroundColor={backgroundStyle.backgroundColor}
//   //     />
//   //     <ScrollView
//   //       contentInsetAdjustmentBehavior="automatic"
//   //       style={backgroundStyle}>
//   //       <Header />
//   //       <View
//   //         style={{
//   //           backgroundColor: isDarkMode ? Colors.black : Colors.white,
//   //         }}>
//   //         <Button title={"Pusher"} onPress={pressHandler} />

//   //         <Section title="Step One">
//   //           <Text style={styles.highlight}> HELLO WORLD! </Text>

//   //         </Section>
//   //         <Section title="See Your Changes">
//   //           <ReloadInstructions />
//   //         </Section>
//   //         <Section title="Debug">
//   //           <DebugInstructions />
//   //         </Section>
//   //         <Section title="Learn More">
//   //           Read the docs to discover what to do next:
//   //         </Section>
//   //         <LearnMoreLinks />
//   //       </View>
//   //     </ScrollView>
//   //   </SafeAreaView>
//   // );
// }



