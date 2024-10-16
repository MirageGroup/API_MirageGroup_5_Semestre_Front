import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import axios from "axios";
import CardHome from "../components/CardHome";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [cardsData, setCardsData] = useState<Array<any>>([]);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        "http://192.168.179.46:8080/locations/all"
      );
      const locations = response.data;

      const updatedLocations = await Promise.all(
        locations.map(async (location) => {
          try {
            const weatherResponse = await axios.get(
              `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&current_weather=true&timezone=auto`
            );

            const dailyData = weatherResponse.data.daily;
            const currentWeather = weatherResponse.data.current_weather;

            return {
              ...location,
              temperature_max_backend: location.temperature_max,
              temperature_min_backend: location.temperature_min,
              temperature_max: Math.round(dailyData.temperature_2m_max[0]),
              temperature_min: Math.round(dailyData.temperature_2m_min[0]),
              temperature: Math.round(currentWeather.temperature),
              precipitation: Math.round(dailyData.precipitation_sum[0]),
            };
          } catch (error) {
            console.error(
              `Erro ao buscar dados da Open Meteo para ${location.name}:`,
              error
            );
            return location;
          }
        })
      );

      setCardsData(updatedLocations);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchLocations();
    }, [])
  );

  const handleCardPress = (location, index) => {
    setSelectedCard(index);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("Dashboard", {
        location: {
          ...location,
          name: location.name,
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
    });
  };

  const filteredCardsData = cardsData.filter((data) =>
    data.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Faixa azul ao fundo */}
      <View style={styles.blueBackground} />

      {/* Conteúdo da tela */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Image
            style={styles.stretch}
            source={require("../../assets/sol.png")}
          />
          <Text style={styles.title}>Seus Cultivos</Text>
        </View>

        {/* Input para busca com ícone */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={32}
            color="#424242"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar um local..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Lista de Cards */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {filteredCardsData.map((data, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCardPress(data, index)}
              activeOpacity={1}
            >
              <Animated.View
                style={[
                  index === selectedCard
                    ? { transform: [{ scale: scaleAnim }] }
                    : {},
                ]}
              >
                <CardHome
                  name={data.name}
                  datetime={data.datetime}
                  temperature={data.temperature}
                  temperature_max={data.temperature_max}
                  temperature_min={data.temperature_min}
                  humidity={data.humidity}
                  temperature_max_backend={data.temperature_max_backend}
                  temperature_min_backend={data.temperature_min_backend}
                />
              </Animated.View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  blueBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: "#A2DAFA",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: -1,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#2D2D2D",
    marginLeft: 10,
  },
  stretch: {
    width: 70,
    height: 70,
    resizeMode: "stretch",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
});

export default Home;
