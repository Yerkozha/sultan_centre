/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { FirebaseMessageHandlers } from '@/services/PushNotificationController';



FirebaseMessageHandlers.mixedMessageHandlers();


AppRegistry.registerComponent(appName, () => App);



/**
 * @author TASK TRACKER
 * 
 * @method CHAT_SOCKET
 * @method GEO_TRACKING
 * @method PAYMENTS
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

/**
 * @FAST_IMAGE android/app/proguard-rules.pro:
 * 
 * 
 * 
 */