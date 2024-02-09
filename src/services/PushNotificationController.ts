import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidColor, AndroidImportance, AndroidVisibility, AuthorizationStatus, EventType, Notification } from "@notifee/react-native";
import {PermissionsAndroid, Platform} from 'react-native';
import { AuthController } from '@/api';

/**
 * You can however increase the priority by setting the priority to high (Android) and content-available to true (iOS) properties on the payload.
 */

interface Device {
  id: number;
  name: Nullable<string>;
  registration_id: string;
  device_id: Nullable<string>;
  active: boolean;
  date_created: string;
  type: 'web' | 'ios' | 'android'; 
}
// 
interface RemoteMessage {
  collapseKey?: string
  data?: unknown
  from?: string
  messageId?: string
  notification?: Notification
  sentTime?: string
  ttl?: number // time to live
}


export class FirebaseMessageHandlers {

  static initializeRemoteMessageHandlers() {

    
    FirebaseMessageHandlers.onMessageBackground()
    FirebaseMessageHandlers.onMessageQuit()
    
    return FirebaseMessageHandlers.onMessageForeground()
  }

  static async onMessageReceived(message) {

    const notifier = NotifyMessages.getInstance('default', 'Default Channel');

    console.log('message', message)
      
    await notifier.displayNotification(message.notification?.title, message.notification?.body)

  }

  static onMessageForeground() {
    const unsubscribers = [];
    
    unsubscribers.push(messaging().onMessage(FirebaseMessageHandlers.onMessageReceived)); // foreground

    unsubscribers.push(notifee.onForegroundEvent(({ type, detail }) => {  // Fire when user pressed notification
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    }));

    return unsubscribers
  }

  static onMessageBackground() {
    messaging().onNotificationOpenedApp(FirebaseMessageHandlers.openedAppNotificationMessage);  // background

  }

  static openedAppNotificationMessage(message) {
    console.log('Opened App message', message)
  }

  static async onMessageQuit(){
    /** 
     * FROM QUIT STATE OPEN APP
     * getInitialNotification is deprecated on iOS in favour of the PRESS event received by the onForegroundEvent event handler
     */

    // const initialNotification = await notifee.getInitialNotification();
    // console.log("notifee EVERY TIME INITIALIZE APP", initialNotification)
    // if (initialNotification) {
    //   console.log('Notification caused application to open', initialNotification.notification);
    //   console.log('Press action used to open the app', initialNotification.pressAction);
    // }

    const notification = await messaging().getInitialNotification();

    if( notification ) {

      console.log('ON QUIT STATE',notification)

    }

    return notification
  }

  public static mixedMessageHandlers() {

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!!!!!!', remoteMessage);          // BACKGROUND STATE+  QUIT STATE+
    });

    notifee.onBackgroundEvent( async ({ type, detail }) => {  // WORK BG?
      
      const { notification, pressAction } = detail;
      console.log("INDEX JS",notification, pressAction, type)
      // Check if the user pressed the "Mark as read" action
      // if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
      //   // Update external API
      //   console.log('CALLED background NOTIFICATION (index.js)', notification, pressAction, type)
    
      //   // Remove the notification
      //   await notifee.cancelNotification(notification.id);
      // }
    });

  }

  public static async requestUserPermission() {

    let
      enabled;

    const authStatus = await messaging().hasPermission();
    console.log('messaging.AuthorizationStatus.AUTHORIZED', messaging.AuthorizationStatus.AUTHORIZED)
    console.log('authStatus',authStatus)

    if ( Platform.OS === 'android' && Number(Platform.Version) >= 33  ) {

      const checkPermission = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS );  // CHECK ANDROID

      if( !checkPermission ) {

        const permissionAndroid = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS ,
          {
            title: 'Notification Permission',
            message: ' Notification requires permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );  // KAKAKH VERSION

        console.log('Android permission', permissionAndroid)

        if (permissionAndroid === PermissionsAndroid.RESULTS.GRANTED) {

          enabled = true
          console.log('INSIDE ANDROID ENABLED PERMISSION')
    
        } else {
    
          console.log('Camera permission denied');
    
        }

      }
      
    } else if(Platform.OS === 'ios' && !(authStatus === messaging.AuthorizationStatus.AUTHORIZED)) {
      /**
       * sound: false,
          announcement: true,
        ... other permission settings
      */
      const authStatus = await messaging().requestPermission(); // IOS BEFORE GET TOKEN

      enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log('Authorization status:', authStatus);

    } else { // Other devices web...
      enabled = true
    }

    if (enabled) {
      
      await FirebaseMessageHandlers.GetFCMToken(Platform.OS)
      
    }

  }
  
  protected static async GetFCMToken(platformType) {

    let fcmtoken = await AsyncStorage.getItem('fcmtoken')

    console.log(fcmtoken, 'oldtoken')

    if( !fcmtoken ) {

      try {

        fcmtoken = await messaging().getToken();

        if( fcmtoken ) {

          await AsyncStorage.setItem('fcmtoken', fcmtoken); // STORE SERVER SIDE

        }else {

        }

      } catch(err){
        console.log(err, 'Error in  fcmtoken')
      }

    }

    if(fcmtoken) {
      const fcmResponse = await AuthController.attachFCMToken<Device>( {registration_id: fcmtoken, type: platformType} );

      if(!fcmResponse?.active) {
        await AsyncStorage.removeItem('fcmtoken');
        await FirebaseMessageHandlers.GetFCMToken(platformType)
      }

    }
    

  }

}

/*
export const NotificationListener = () => {
  
  // priority to high (Android) and content-available to true (iOS)

  messaging().onMessage(onMessageReceived); // foreground

  messaging().onNotificationOpenedApp(onMessageReceived)  // background

  // const notification = await messaging().getInitialNotification()  // quit

  function onMessageReceived(message: any) {
    console.log(message,' message!');

    (async ()=> {
      
       
      const notifier = NotifyMessages.getInstance('default', 'Default Channel'); 

      await notifier.displayNotification(message.notification?.title, message.notification?.body)
    })()

  }
}
*/

interface IBaseNotify {
  /**
   * All api
   */

}

abstract class BaseNotify implements IBaseNotify {

  /**
   * cut load 
   */

  async requestPermission() {   // CHECK WHETHER SHOULD BE IN SUBCLASS

    const settings = await notifee.requestPermission() // IOS

    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
       console.log('User denied permissions request');
     } else if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        console.log('User granted permissions request');
     } else if (settings.authorizationStatus === AuthorizationStatus.PROVISIONAL) {
        console.log('User provisionally granted permissions request');
     }
    
  }

  async createChannel() {
    // Create a channel (required for Android)
    let channelId: string | Awaited<ReturnType<typeof notifee.getChannel>> = await notifee.getChannel(this.channelId);

    if(!channelId) {

      channelId = await notifee.createChannel({
        id: this.channelId,
        name: this.channelName,
        importance: AndroidImportance.DEFAULT, // HIGH LOW MIN NONE
        lightColor: AndroidColor.RED,
        lights: true,
        vibration: true, // ux/ui
        visibility: AndroidVisibility.PUBLIC
      });

    }
    
  }
  
  constructor(protected channelId: Nullable<string> = 'default', protected readonly channelName: Nullable<string> = 'Default Channel') {

    (async() => {
      await this.requestPermission()
      await this.createChannel()
    })()
    
  }
  
}

export class NotifyMessages extends BaseNotify {

  /**
   * implement 
   */
 
  constructor(channelId , channelName ) {
    super( channelId, channelName )
    
    
  }
  
  private static _instance: Nullable<NotifyMessages> = null;

  static getInstance(channelId, channelName) {

    if(!NotifyMessages._instance) {
      NotifyMessages._instance = new NotifyMessages(channelId, channelName) 
    }
    return NotifyMessages._instance
  }

  async displayNotification(title: string = 'Notification Title', body: string = 'Main body content of the notification') {

    /** As our example never returns the promise, the notification will exist for the lifetime of the application
     * asForegroundService: true
     * colorized: true,
     * color: AndroidColor.RED
     */

    console.log('this.',this)

    const notificationId = await notifee.displayNotification({ //cancelNotification(notificationId)
      title, // supports plain html/css
      body,
      android: {
        smallIcon: 'ic_launcher',  // icon
        channelId: this.channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
    
    return notificationId
  }

}


/**
 * admin.messaging().sendToDevice(
  [], // device fcm tokens...
  {
    data: {
      owner: JSON.stringify(owner),
      user: JSON.stringify(user),
      picture: JSON.stringify(picture),
    },
  },
  {
    // Required for background/quit data-only messages on iOS
    contentAvailable: true,
    // Required for background/quit data-only messages on Android
    priority: 'high',
  },
);
 */