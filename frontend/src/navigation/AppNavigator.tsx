import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/Home';
import RegisterLocation from '../screens/RegisterLocation';
import Dashboard from '../screens/Dashboard';
import Profile from '../screens/Profile';

type StackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Location: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Stack.Navigator initialRouteName="Location">
        <Stack.Screen
          name="Location"
          component={RegisterLocation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Stack.Navigator initialRouteName="Profile">
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default AppNavigator;
