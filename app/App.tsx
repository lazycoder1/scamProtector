import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Button, Text, Platform, PermissionsAndroid } from 'react-native';
import { useReactiveClient } from '@dynamic-labs/react-hooks';
import { dynamicClient } from './src/utils/dynamicClient';
import CallDetectorManager from 'react-native-call-detection';
import { CallHistoryScreen } from './src/screens/CallHistoryScreen';
import { ChallengeScreen } from './src/screens/ChallengeScreen';

const Tab = createBottomTabNavigator();

function App() {
  const { auth } = useReactiveClient(dynamicClient);

  useEffect(() => {
    setupPermissionsAndCallDetection();
  }, []);

  const setupPermissionsAndCallDetection = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          {
            title: "Phone State Permission",
            message: "This app needs access to your phone state to detect calls.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Phone state permission granted");
          setupCallDetection();
        } else {
          console.log("Phone state permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // For iOS, permissions are typically handled through Info.plist
      setupCallDetection();
    }
  };

  const setupCallDetection = () => {
    const callDetector = new CallDetectorManager(
      (event, number) => {
        if (event === 'Disconnected') {
          // Call is disconnected
          console.log('Call ended');
        } else if (event === 'Connected') {
          // Call is connected
          console.log('Call started');
        }
      },
      false, // if you want to read the phone number of the incoming call [ANDROID], otherwise false
      () => {}, // callback if your permission got denied [ANDROID] [only if you want to read incoming number] default: console.error
      {
        title: 'Phone State Permission',
        message: 'This app needs access to your phone state in order to react and/or to adapt to incoming calls.'
      }
    );
  };

  const connectGoogle = async () => {
    try {
      await auth.social.connect({ provider: 'google' });
      console.log('Google connection successful');
    } catch (error) {
      console.error('Google connection failed:', error);
    }
  };

  const connectApple = async () => {
    try {
      await auth.social.connect({ provider: 'apple' });
      console.log('Apple connection successful');
    } catch (error) {
      console.error('Apple connection failed:', error);
    }
  };

  if (!auth.authenticatedUser) {
    return (
      <SafeAreaProvider>
        <dynamicClient.reactNative.WebView />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Please connect to continue:</Text>
          <Button title="Connect with Google" onPress={connectGoogle} />
          <Button title="Connect with Apple" onPress={connectApple} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Call History" component={CallHistoryScreen} />
          <Tab.Screen name="Challenge" component={ChallengeScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;