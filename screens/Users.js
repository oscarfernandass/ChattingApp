import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const Users = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('USERNAME');
        setCurrentUser(name);
        if (name) {
          await getUsers(name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigation]);

  const getUsers = async (currentUser) => {
    try {
      const querySnapshot = await firestore().collection('users').get();
      const tempData = querySnapshot.docs
        .filter(doc => doc.data().name !== currentUser)
        .map(doc => ({ id: doc.id, name: doc.data().name }));
      setUsers(tempData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('Chat', { userId: item.id, name: item.name })}>
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.group} onPress={() => navigation.navigate('GroupChat')}>
        <Text style={styles.groupText}>Group Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  userItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  group: {
    backgroundColor: 'green',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontSize: 18,
    color: 'black',
  },
  groupText: {
    fontSize: 18,
    color: 'white',
  },
});

export default Users;
