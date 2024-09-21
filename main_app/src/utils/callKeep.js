import RNCallKeep from 'react-native-callkeep';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const options = {
  ios: {
    appName: 'SpamProtectorApp',
  },
};

export const setupCallKeep = () => {
  RNCallKeep.setup(options).then(() => {
    RNCallKeep.setAvailable(true);
  });

  RNCallKeep.addEventListener('didReceiveStartCallAction', handleStartCallAction);
  RNCallKeep.addEventListener('answerCall', handleAnswerCall);
  RNCallKeep.addEventListener('endCall', handleEndCall);
};

const handleStartCallAction = async (data) => {
  const { handle } = data;
  const callUUID = uuid.v4();
  RNCallKeep.startCall(callUUID, handle, handle);
  await addCallToHistory(handle);
};

const handleAnswerCall = async (data) => {
  const { callUUID } = data;
  RNCallKeep.answerIncomingCall(callUUID);
};

const handleEndCall = async (data) => {
  const { callUUID } = data;
  RNCallKeep.endCall(callUUID);
};

const addCallToHistory = async (phoneNumber) => {
  try {
    const storedHistory = await AsyncStorage.getItem('callHistory');
    let callHistory = storedHistory ? JSON.parse(storedHistory) : [];

    // Add new call to history
    const newCall = {
      id: uuid.v4(),
      number: phoneNumber,
      date: new Date().toISOString(),
      spamReports: 0,
    };

    callHistory = [newCall, ...callHistory];

    // Keep only last 24 hours of calls
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    callHistory = callHistory.filter(call => new Date(call.date) > twentyFourHoursAgo);

    await AsyncStorage.setItem('callHistory', JSON.stringify(callHistory));
  } catch (error) {
    console.error('Error adding call to history:', error);
  }
};