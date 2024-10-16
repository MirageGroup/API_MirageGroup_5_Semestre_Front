import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FontAwesome5, FontAwesome6, Feather, Ionicons } from '@expo/vector-icons';
type RootStackParamList = {
  Home: undefined;
  Dashboard: undefined;
  Location: undefined;
  Profile: undefined;
};

const Navbar = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activePage, setActivePage] = useState<'Home' | 'Dashboard' | 'Location' | 'Profile'>('Home');

  const handleNavigation = (page: 'Home' | 'Dashboard' | 'Location' | 'Profile') => {
    setActivePage(page);
    navigation.navigate(page);
  };

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => handleNavigation('Home')} style={[styles.button, activePage === 'Home' && styles.activeButton]}>
          <Ionicons name="grid" size={32} color={activePage === 'Home' ? '#3874CF' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('Location')} style={[styles.button, activePage === 'Location' && styles.activeButton]}>
          <Feather name="plus-circle" size={38} color={activePage === 'Location' ? '#3874CF' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('Profile')} style={[styles.button, activePage === 'Profile' && styles.activeButton]}>
          <FontAwesome5 name="user-alt" size={30} color={activePage === 'Profile' ? '#3874CF' : 'black'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    marginHorizontal: 10,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#fff',
  },
  button: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    minWidth: 55,
  },
  activeButton: {
    backgroundColor: '#DEEBFD',
    borderRadius: 50,
  },
});


export default Navbar;