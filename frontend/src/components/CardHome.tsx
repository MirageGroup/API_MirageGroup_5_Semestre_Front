import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

interface CardHomeProps {
  name: string;
  datetime: string;
  temperature: string;
  temperature_max: string;
  temperature_min: string;
  humidity: string;
}

const CardHome: React.FC<CardHomeProps> = ({ name, datetime, temperature, temperature_max, temperature_min, humidity }) => {
  return (
    <View style={styles.card}>
      <View style={styles.title}>
        <Text style={styles.location}>{name}, </Text>
        <Text style={styles.date}>{datetime}</Text>
      </View>
      <View style={styles.temp}>
        <Text style={styles.temperature}>{temperature}°C</Text>
        <View style={styles.tempRangeContainer}>
          <Text style={styles.highTemp}>{temperature_max}°↑</Text>
          <Text style={styles.lowTemp}>{temperature_min}°↓</Text>
        </View>
      </View>
      {(temperature > temperature_max || temperature < temperature_min) && temperature ?
        <View style={styles.alertContainer}>
          <Feather name="alert-triangle" size={24} color="red" />
          <Text style={styles.alertText}>
            Hoje as temperaturas vão estar {temperature > temperature_max ? 'acima' : 'abaixo'} da temperatura {temperature > temperature_max ? 'maxima' : 'minima'} do cultivo!
          </Text>
        </View> : null
      }
      <Text style={styles.rainfall}>
        Índice de umidade atual: <Text style={styles.rainfallPercentage}>{humidity}%</Text>
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
    fontSize: 18,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#333',
  },
  temperature: {
    fontSize: 50,
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

  alertContainer:{
    flex:1,
    flexDirection: 'row',
    alignItems:"center",
    gap:8,
    marginBottom:8,
    
  },

  alertText:{
    marginRight:26,
    
  }
});

export default CardHome;
