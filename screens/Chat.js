import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

const Chat = ({ route }) => {
  const { userId, name } = route.params;
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('UID');
      setCurrentUserId(id);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const unsubscribeListener = firestore()
      .collection('messages')
      .doc(currentUserId)
      .collection('chats')
      .doc(userId) 
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const formattedMessages = querySnapshot.docs.map((doc) => {
          const message = doc.data();
          return {
            _id: doc.id,
            text: message.text,
            createdAt: message.createdAt.toDate(),
            user: {
              _id: message.senderId,
              name: message.senderName,
            },
          };
        });
        setMessages(formattedMessages);
      });

    return () => unsubscribeListener();
  }, [currentUserId, userId]);

  const onSend = async (newMessages = []) => {
    const currentUserName = await AsyncStorage.getItem('USERNAME');
    const message = {
      text: newMessages[0].text,
      createdAt: new Date(),
      senderId: currentUserId,
      senderName: currentUserName,
    };


    const batch = firestore().batch();
    const senderRef = firestore()
      .collection('messages')
      .doc(currentUserId)
      .collection('chats')
      .doc(userId)
      .collection('messages')
      .doc();
    const recipientRef = firestore()
      .collection('messages')
      .doc(userId)
      .collection('chats')
      .doc(currentUserId)
      .collection('messages')
      .doc();

    batch.set(senderRef, message);
    batch.set(recipientRef, message);

    await batch.commit();
  };

  if (!currentUserId) {
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <GiftedChat
        textInputProps={{
            style: { color: 'black',width:'80%' } 
        }}
        messages={messages}
        onSend={onSend}
        user={{
          _id: currentUserId,
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: styles.leftBubble,
              right: styles.rightBubble,
            }}
          />
        )}
        renderTime={(props) => (
          <Text style={[styles.timeText, { color: props.currentMessage.user._id === currentUserId ? 'white' : 'black' }]}>
            {props.currentMessage.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftBubble: {
    backgroundColor: 'lightgray',
  },
  rightBubble: {
    backgroundColor: 'green',
  },
  timeText: {
    marginHorizontal: 10,
    marginBottom: 5,
  },
});

export default Chat;
