import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CallWidget = ({ phoneNumber, spamReports, onBlock }) => {
  const isSpam = spamReports > 5; // Example threshold

  return (
    <View style={styles.container}>
      <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      <Text style={[styles.spamStatus, isSpam && styles.spamStatusWarning]}>
        {isSpam ? 'Potential Spam' : 'Normal Call'}
      </Text>
      <Text style={styles.spamReports}>Spam Reports: {spamReports}</Text>
      <TouchableOpacity style={styles.blockButton} onPress={onBlock}>
        <Text style={styles.blockButtonText}>Block</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spamStatus: {
    fontSize: 16,
    marginVertical: 5,
  },
  spamStatusWarning: {
    color: 'red',
  },
  spamReports: {
    fontSize: 14,
  },
  blockButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  blockButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CallWidget;