import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CallHistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [callHistory, setCallHistory] = useState([]);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    loadCallHistory();
    checkVerificationStatus();
  }, []);

  const loadCallHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('callHistory');
      if (storedHistory) {
        setCallHistory(JSON.parse(storedHistory));
      } else {
        // Dummy data
        const dummyData = [
          { id: '1', number: '+1234567890', date: new Date().toISOString(), spamReports: 2 },
          { id: '2', number: '+9876543210', date: new Date().toISOString(), spamReports: 0 },
          { id: '3', number: '+1122334455', date: new Date().toISOString(), spamReports: 5 },
        ];
        setCallHistory(dummyData);
        await AsyncStorage.setItem('callHistory', JSON.stringify(dummyData));
      }
    } catch (error) {
      console.error('Error loading call history:', error);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      const proof = await AsyncStorage.getItem('worldIDProof');
      setIsVerified(!!proof);
    } catch (e) {
      console.error('Failed to get the proof', e);
    }
  };

  const markAsSpam = async (id) => {
    if (!isVerified) {
      console.log('User not verified. Cannot mark as spam.');
      return;
    }
    console.log(`Marked as spam: ${id}`);
    const updatedHistory = callHistory.map(call => 
      call.id === id ? { ...call, spamReports: (call.spamReports || 0) + 1 } : call
    );
    setCallHistory(updatedHistory);
    try {
      await AsyncStorage.setItem('callHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving call history:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.callItem}>
      <Text>{item.number}</Text>
      {/* <Text>{new Date(item.date).toLocaleString()}</Text> */}
      <TouchableOpacity 
        onPress={() => markAsSpam(item.id)} 
        style={[styles.spamButton, !isVerified && styles.disabledButton]}
        disabled={!isVerified}
      >
        <Text>Mark as Spam</Text>
      </TouchableOpacity>
      <View style={styles.spamCount}>
        <Text>Reports: {item.spamReports || 0}</Text>
      </View>
    </View>
  );

  const filteredHistory = callHistory.filter(call => call.number.includes(searchQuery));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  callItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  spamButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    opacity: 0.5,
  },
  spamCount: {
    backgroundColor: '#e0e0e0',
    padding: 5,
    borderRadius: 5,
    minWidth: 30,
    alignItems: 'center',
  },
});

export default CallHistoryScreen;