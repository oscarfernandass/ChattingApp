import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login.js';
import Users from './screens/Users.js';
import Chat from './screens/Chat.js';
import GroupChat from './screens/GroupChat.js';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="Users"
          component={Users}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
        />
        <Stack.Screen
          name="GroupChat"
          component={GroupChat}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
