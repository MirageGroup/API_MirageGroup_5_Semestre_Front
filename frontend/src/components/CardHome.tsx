import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import * as Notifications from 'expo-notifications';

interface CardHomeProps {
  name: string;
  datetime: string;
  temperature: string;
  temperature_max: string;
  temperature_min: string;
  temperature_max_backend: string;
  temperature_min_backend: string;
  humidity: string;
}

const getData = new Date();

const dia = getData.getDate();
const mes = getData.getMonth() + 1;
const ano = getData.getFullYear();

const dataHoje = `${dia}/${mes}/${ano}`;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const sendNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null, 
  });
};

const CardHome: React.FC<CardHomeProps> = ({ name, datetime, temperature, temperature_max, temperature_min, humidity }) => {
  
  const showAlert = temperature > temperature_max || temperature < temperature_min;
  
  useEffect(() => {
    if(showAlert) {
      const title = 'Alerta de Temperatura!';
      const body = `As temperaturas de ${name} estão ${temperature > temperature_max ? 'acima' : 'abaixo'} da faixa recomendada.`
      
      sendNotification(title, body);
    }
  }, [showAlert]);
  
  return (
    <View style={styles.card}>
      <View style={styles.title}>
        <Text style={styles.location}>{name}, </Text>
        <Text style={styles.date}>{dataHoje}</Text>
      </View>
      <View style={styles.temp}>
        <Text style={styles.temperature}>{temperature}°C</Text>
        <View style={styles.tempRangeContainer}>
          <Text style={{ color: "#000", fontWeight: "300", fontSize: 18 }}>{temperature_max}°</Text>
          <Text style={{ color: "#FF0000", fontSize: 18 }}>↑</Text>
          <Text style={{ color: "#000", fontWeight: "300", fontSize: 18 }}>{temperature_min}°</Text>
          <Text style={{ color: "#007BFF", fontSize: 18 }}>↓</Text>
        </View>
      </View>
      
      {showAlert && (
      {(temperature_max > temperature_max_backend || temperature_min < temperature_min_backend) ? (
        <View style={styles.alertContainer}>
          <Feather name="alert-triangle" size={24} color="red" />
          <Text style={styles.alertText}>
            Hoje as temperaturas vão estar{" "}
            {temperature_max > temperature_max_backend ? "acima" : "abaixo"} da temperatura{" "}
            {temperature_max > temperature_max_backend ? "máxima" : "mínima"} do cultivo registrado!
          </Text>
        </View>
      )}
      <Text style={styles.rainfall}>
        Índice de pluviometria atual:{" "}
        <Text style={styles.rainfallPercentage}>{humidity}%</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fbfbfb",
    borderRadius: 10,
    marginHorizontal: 4,
    padding: 25,
    marginBottom: 15,
    marginTop: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  title: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  temp: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
  },
  date: {
    fontSize: 12,
    fontWeight: '300',
    color: "#333",
  },
  temperature: {
    fontSize: 46,
    fontWeight: "bold",
    color: "#1E1E1E",
    marginRight: 14,
  },
  tempRangeContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  rainfall: {
    fontSize: 14,
    color: "#000",
    fontWeight: '300',
    marginTop: 10
  },
  rainfallPercentage: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },

  alertContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  alertText: {
    marginRight: 26,
    fontSize: 10,
  },
});

export default CardHome;
