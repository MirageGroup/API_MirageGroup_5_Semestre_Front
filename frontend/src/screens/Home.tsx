import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';
import CardHome from '../components/CardHome';

const Home: React.FC = () => {
  const [cardsData, setCardsData] = useState<Array<{
    location: string;
    date: string;
    temperature: string;
    highTemp: string;
    lowTemp: string;
    rainfallPercentage: string;
  }>>([]);

  useEffect(() => {
    // Substitua a URL pela URL do seu endpoint
    axios.get('https://api.exemplo.com/weather')
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
            location={data.location}
            date={data.date}
            temperature={data.temperature}
            highTemp={data.highTemp}
            lowTemp={data.lowTemp}
            rainfallPercentage={data.rainfallPercentage}
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
