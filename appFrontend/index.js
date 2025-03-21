/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { handleNotificationPress } from '@/global/utils/pushNotification';

if (__DEV__) {
  require('./ReactotronConfig');
}

if (Platform.OS !== 'android') {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    handleNotificationPress(remoteMessage);
  });
}

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
