import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CallHistoryScreen from './src/screens/CallHistoryScreen.jsx';
import ChallengeScreen from './src/screens/ChallengeScreen.jsx';
import { setupCallKeep } from './src/utils/callKeep.js';

const Tab = createBottomTabNavigator();

const App = () => {
  useEffect(() => {
    setupCallKeep();
  }, []);

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;