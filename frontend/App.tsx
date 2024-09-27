import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navbar from './src/components/Navbar';
import Tela1 from './src/screens/Teste1';
import Tela2 from './src/screens/Teste2';
import Home from './src/screens/Home';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Statistics" component={Tela1} />
        <Stack.Screen name="Add" component={Tela2} />
        <Stack.Screen name="Profile" component={Tela2} />
      </Stack.Navigator>
      <Navbar />
    </NavigationContainer>
  );
}


