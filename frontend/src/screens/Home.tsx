import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';
import CardHome from '../components/CardHome';

const Home: React.FC = () => {
  const [cardsData, setCardsData] = useState<Array<{
    name: string;
    datetime: string;
    temperature: string;
    temperature_max: string;
    temperature_min: string;
    humidity: string;
  }>>([]);

  useEffect(() => {

    axios.get('http://192.168.15.5:8080/locations/all')
      .then(response => {
        setCardsData(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.stretch}
          source={require('../../assets/sol.png')} />
        <Text style={styles.title}>Seus Cultivos</Text>
      </View>

      {/* Lista de Cards */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {cardsData.map((data, index) => (
          <CardHome
            key={index}
            name={data.name}
            datetime={data.datetime}
            temperature={data.temperature}
            temperature_max={data.temperature_max}
            temperature_min={data.temperature_min}
            humidity={data.humidity}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'light',
    color: '#333',
    marginLeft: 10,
  },
  stretch: {
    width: 60,
    height: 60,
    resizeMode: 'stretch',
  },
  scrollView: {
    flex: 1,
  },
});

export default Home;
