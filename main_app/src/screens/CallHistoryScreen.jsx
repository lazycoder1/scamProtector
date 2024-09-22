import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const CallHistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [callHistory, setCallHistory] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [description, setDescription] = useState('');
  const [scamType, setScamType] = useState('0');
  const [isPickerVisible, setPickerVisible] = useState(false);

  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const searchNumber = async () => {
    if (!searchQuery) return;

    setIsSearching(true);
    try {
      const response = await fetch('https://scam-protector.vercel.app/api/scamOrNot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: searchQuery }),
      });

      const result = await response.json();
      setSearchResult(result);
      setIsSearchModalVisible(true);
    } catch (error) {
      console.error('Error searching number:', error);
      setSearchResult({ error: 'Failed to fetch data' });
    } finally {
      setIsSearching(false);
    }
  };

  const closeSearchModal = () => {
    setIsSearchModalVisible(false);
    setSearchResult(null);
  };
  useEffect(() => {
    loadCallHistory();
    checkVerificationStatus();
  }, []);

  const getScamTypeLabel = (value) => {
    switch (value) {
      case '0': return 'Bank Scam';
      case '1': return 'Software Scam';
      case '2': return 'Visa Scam';
      case '3': return 'Other';
      default: return 'Select Scam Type';
    }
  };

  
  const loadCallHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('callHistory');
      if (storedHistory) {
        // setCallHistory(JSON.parse(storedHistory));
        const dummyData = [
          { id: '1', number: '1234567890', date: new Date().toISOString(), spamReports: 2 },
          { id: '2', number: '6876543210', date: new Date().toISOString(), spamReports: 0 },
          { id: '3', number: '3122334455', date: new Date().toISOString(), spamReports: 4 },
        ];
        setCallHistory(dummyData);
      } else {
        // Dummy data
        const dummyData = [
          { id: '1', number: '1234567890', date: new Date().toISOString(), spamReports: 2 },
          { id: '2', number: '6876543210', date: new Date().toISOString(), spamReports: 0 },
          { id: '3', number: '3122334455', date: new Date().toISOString(), spamReports: 4 },
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

  const openSpamDialog = (call) => {
    setDescription('');
    setScamType('0');
    setModalVisible(true);
    setSelectedCall(call);
  };
  const closeSpamDialog = () => {
    setModalVisible(false);
    setSelectedCall(null);
    setDescription('');
    setScamType('0');
  };

  const submitSpamReport = async (call) => {
    if (!isVerified) return;
  
    const submittedBy = await AsyncStorage.getItem('uniqueAppHash');
    const reportCall = {
      obfuscatedNumber: call.number,
      callTime: Date.now(),
      label: description,
      callType: parseInt(scamType)
    };
  
    try {
      const response = await fetch("https://scam-protector.vercel.app/api/submitCalls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ calls: [reportCall], submittedBy }),
      });
  
      const result = await response.json();
      console.log(result);
  
      // Update local call history
      const updatedHistory = callHistory.map(item => 
        item.id === call.id ? { ...item, spamReports: (item.spamReports || 0) + 1 } : item
      );
      setCallHistory(updatedHistory);
      await AsyncStorage.setItem('callHistory', JSON.stringify(updatedHistory));
  
      closeSpamDialog();
    } catch (error) {
      console.error('Error submitting spam report:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.callItem}>
      <Text>{item.number}</Text>
      <TouchableOpacity 
        onPress={() => openSpamDialog(item)} 
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
    <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={searchNumber}
          disabled={isSearching}
        >
          <Text style={styles.searchButtonText}>
            {isSearching ? '...' : 'Search'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Spam</Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <Text style={styles.inputLabel}>Type of Spam/Scam</Text>
            <TouchableOpacity
  style={styles.pickerButton}
  onPress={() => {
    console.log('Opening picker');
    setPickerVisible(true);
  }}
>
  <Text>{getScamTypeLabel(scamType)}</Text>
  <Text style={{color: '#007AFF'}}>Select</Text>
</TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={closeSpamDialog}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
  style={[styles.button, styles.submitButton]} 
  onPress={() => submitSpamReport(selectedCall)}
>
  <Text style={[styles.buttonText, styles.submitButtonText]}>Submit</Text>
</TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
      visible={isPickerVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.pickerModalBackground}>
        <View style={styles.pickerModalContent}>
          <Picker
            selectedValue={scamType}
            onValueChange={(itemValue) => {
              setScamType(itemValue);
              setPickerVisible(false);
            }}
          >
            <Picker.Item label="Spam" value="0" />
            <Picker.Item label="Scam" value="1" />
           
          </Picker>
          <TouchableOpacity
            style={styles.pickerCloseButton}
            onPress={() => setPickerVisible(false)}
          >
            <Text style={styles.pickerCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    <Modal
        visible={isSearchModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Search Result</Text>
            {searchResult && searchResult.success ? (
              <View>
                {searchResult.result.scam ? (
                  <>
                    <Text style={styles.scamText}>This number is a scam!</Text>
                    <Text>Score: {searchResult.result.score}</Text>
                    {searchResult.result.meta && searchResult.result.meta.flaggedCalls && searchResult.result.meta.flaggedCalls.length > 0 && (
                      <>
                        <Text>Description: {searchResult.result.meta.flaggedCalls[0].label}</Text>
                        <Text>Number of Reports: {searchResult.result.meta.flaggedCalls.length}</Text>
                      </>
                    )}
                  </>
                ) : (
                  <Text style={styles.safeText}>This number is not a scam.</Text>
                )}
              </View>
            ) : (
              <Text>No data available for this number.</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={closeSearchModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  callItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  spamButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ddd',
    opacity: 0.5,
  },
  spamCount: {
    backgroundColor: '#e0e0e0',
    padding: 5,
    borderRadius: 5,
    minWidth: 30,
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    color: 'white',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerModalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerCloseButton: {
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  pickerCloseButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },

  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingRight: 60, // Make room for the button
    backgroundColor: 'white',
  },
  searchButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    bottom: 5,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingRight: 60,
    backgroundColor: 'white',
  },
  searchButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    bottom: 5,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  scamText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  safeText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18,
  },

});

export default CallHistoryScreen;