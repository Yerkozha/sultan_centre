import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from "@notifee/react-native";

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken()
  }
}

async function GetFCMToken () {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken')
  console.log(fcmtoken, 'oldtoken')
  if( !fcmtoken ) {
    try {
      let fcmtoken = await messaging().getToken()
      if( fcmtoken ) {

        await AsyncStorage.setItem('fcmtoken', fcmtoken)

      }else {

      }
    } catch(err){
      console.log(err, 'Error in  fcmtoken')
    }
  }
}

export const NotificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });


  function onMessageReceived(message: any) {
    console.log(message,' message!');
    (async ()=> {
      await notifee.requestPermission()

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      // Display a notification
      await notifee.displayNotification({
        title: 'Notification Title',
        body: 'Main body content of the notification',
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    })()

  }

  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(async (message) => onMessageReceived(message));
}


async function onDisplayNotification() {
 


  await notifee.requestPermission()
 

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification

  await notifee.displayNotification({
    title: '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
    subtitle: '&#129395;',
    body:
      'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
    android: {
      channelId,
      color: '#4caf50',
      actions: [
        {
          title: '<b>Dance</b> &#128111;',
          pressAction: { id: 'dance' },
        },
        {
          title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
          pressAction: { id: 'cry' },
        },
      ],
    },
  });


}