import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const Navbar: React.FC = () => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.iconButton}>
        <Image source={require('../assets/grid.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Image source={require('../assets/chart.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Image source={require('../assets/plus.png')} style={[styles.icon, { width: 32, height: 32 }]} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Image source={require('../assets/frame.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  iconButton: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Navbar;
