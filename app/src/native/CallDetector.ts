import { NativeModules, NativeEventEmitter } from 'react-native';

const { CallDetectorManager } = NativeModules;
const callDetectorEmitter = new NativeEventEmitter(CallDetectorManager);

export const startCallDetection = (callback: (status: string, phoneNumber: string) => void) => {
  CallDetectorManager.startCallDetection((status: string, phoneNumber: string) => {
    callback(status, phoneNumber);
  });

  return callDetectorEmitter.addListener('CallDetector', callback);
};

export const stopCallDetection = () => {
  CallDetectorManager.stopCallDetection();
};