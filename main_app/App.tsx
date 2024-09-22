import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, StyleSheet, Modal, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CallHistoryScreen from './src/screens/CallHistoryScreen.jsx';
import ChallengeScreen from './src/screens/ChallengeScreen.jsx';
import { setupCallKeep } from './src/utils/callKeep.js';
import AIAgentScreen from './src/screens/AIAgentScreen.jsx';
import WorldIDVerification from './src/screens/WorldIDVerification.tsx';


const Tab = createBottomTabNavigator();

const App = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setupCallKeep();
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const proof = await AsyncStorage.getItem('worldIDProof');
      setIsVerified(!!proof);
    } catch (e) {
      console.error('Failed to get the proof', e);
    }
  };

  const openWorldIDVerification = () => {
    setModalVisible(true);
  };

  const closeWorldIDVerification = () => {
    setModalVisible(false);
  };

  const handleVerificationSuccess = async (result) => {
    try {
      await AsyncStorage.setItem('worldIDProof', JSON.stringify(result.proof));
      setIsVerified(true);
      closeWorldIDVerification();
    } catch (e) {
      console.error('Failed to save the proof', e);
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen 
            name="Call History" 
            component={CallHistoryScreen}
            options={{
              headerRight: () => (
                <Button
                  onPress={isVerified ? null : openWorldIDVerification}
                  title={isVerified ? "Verified ✓" : "Verify with World ID"}
                  color={isVerified ? "green" : "#841584"}
                  disabled={isVerified}
                />
              ),
            }}
          />
          <Tab.Screen name="AI Agent" component={AIAgentScreen} />
          <Tab.Screen name="Challenge" component={ChallengeScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <Modal
        visible={isModalVisible}
        onRequestClose={closeWorldIDVerification}
        animationType="slide"
      >
        <WorldIDVerification
          onClose={closeWorldIDVerification}
          onVerificationSuccess={handleVerificationSuccess}
        />
      </Modal>
    </SafeAreaProvider>
  );
};

export default App;