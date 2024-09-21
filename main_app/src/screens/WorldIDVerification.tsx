import React, { useRef, useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUniqueHash } from '../utils/generateAddress.ts';

interface WorldIDVerificationProps {
  onClose: () => void;
  onVerificationSuccess: (result: any) => void;
}

const WorldIDVerification: React.FC<WorldIDVerificationProps> = ({ onClose, onVerificationSuccess }) => {
  const webViewRef = useRef<WebView>(null);
  const [uniqueAddress, setUniqueAddress] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniqueAddress = async () => {
      const address = await getUniqueHash();
      setUniqueAddress(address);
    };
    fetchUniqueAddress();
  }, []);

  const handleWebViewMessage = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log("Message from WebView:", data);
    if ( data.status === true) {
      try {
        await AsyncStorage.setItem('worldIDProof', JSON.stringify({
          proof: data.proof,
          address: uniqueAddress
        }));
        onVerificationSuccess(data);
        console.log("proof saved, success response received")
      } catch (e) {
        console.error('Failed to save the proof', e);
      }
    }
  };

  if (!uniqueAddress) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>World ID Verification</Text>
      <WebView
        ref={webViewRef}
        source={{ uri: `https://5f84-223-255-254-102.ngrok-free.app?address=${encodeURIComponent(uniqueAddress)}` }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
      />
      <View style={styles.buttonContainer}>
        <Button title="Close" onPress={onClose} color="#841584" />
      </View>
    </View>
  );

};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    padding: 10,
  },
});

export default WorldIDVerification;