import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TextInput } from 'react-native';

const dummyCallData = [
  { id: '1', number: '1234567890', spamCount: 2, date: new Date().toISOString() },
  { id: '2', number: '9876543210', spamCount: 0, date: new Date().toISOString() },
  // Add more dummy data as needed
];

function CallHistoryScreen() {
  const [calls, setCalls] = useState(dummyCallData);
  const [searchQuery, setSearchQuery] = useState('');

  const markAsSpam = (id: string) => {
    setCalls(calls.map(call => 
      call.id === id ? { ...call, spamCount: call.spamCount + 1 } : call
    ));
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.callItem}>
      <Text>{item.number}</Text>
      <Text>{new Date(item.date).toLocaleString()}</Text>
      <Button title="Mark as Spam" onPress={() => markAsSpam(item.id)} />
      <View style={styles.spamCount}>
        <Text>{item.spamCount}</Text>
      </View>
    </View>
  );

  const filteredCalls = calls.filter(call => 
    call.number.includes(searchQuery)
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search numbers..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredCalls}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  callItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spamCount: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CallHistoryScreen;