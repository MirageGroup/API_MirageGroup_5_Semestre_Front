import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navbar from './src/components/Navbar';
import Home from './src/screens/Home';
import RegisterLocation from './src/screens/RegisterLocation';
import Dashboard from './src/screens/Dashboard';
import Profile from './src/screens/Profile';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Location" component={RegisterLocation} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
      <Navbar />
    </NavigationContainer>
  );
}
