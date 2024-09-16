import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CardHomeProps {
  location: string;
  date: string;
  temperature: string;
  highTemp: string;
  lowTemp: string;
  rainfallPercentage: string;
}

const CardHome: React.FC<CardHomeProps> = ({ location, date, temperature, highTemp, lowTemp, rainfallPercentage }) => {
  return (
    <View style={styles.card}>
      <View style={styles.title}>
        <Text style={styles.location}>{location}, </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.temp}>
        <Text style={styles.temperature}>{temperature}°C</Text>
        <View style={styles.tempRangeContainer}>
          <Text style={styles.highTemp}>{highTemp}↑</Text>
          <Text style={styles.lowTemp}>{lowTemp}↓</Text>
        </View>
      </View>
      <Text style={styles.rainfall}>
        Índice de pluviometria atual: <Text style={styles.rainfallPercentage}>{rainfallPercentage}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  temp: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  location: {
    fontSize: 22,
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#333',
  },
  temperature: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginRight: 14
  },
  tempRangeContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  highTemp: {
    fontSize: 18,
    color: '#007BFF',
  },
  lowTemp: {
    fontSize: 18,
    marginLeft: 12,
    color: '#FF0000',
  },
  rainfall: {
    fontSize: 14,
    color: '#666',
  },
  rainfallPercentage: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
});

export default CardHome;
