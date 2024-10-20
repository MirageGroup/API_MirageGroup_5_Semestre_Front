import { MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { ActivityIndicator, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import { API_URL } from "@env";
import { StackNavigationProp } from "@react-navigation/stack";
type StackParamList = {
  Home: undefined;
};

type NavigationProps = StackNavigationProp<StackParamList, 'Home'>;

const Dashboard: React.FC<{ route: any }> = ({ route }) => {
  const navigation = useNavigation<NavigationProps>();

  const { location } = route.params;

  const formatDay = (date: Date): string => {
    return String(date.getDate()).padStart(2, "0");
  };

  const getData = new Date();
  const dia = getData.getDate();
  const mes = getData.getMonth() + 1;
  const ano = getData.getFullYear();
  const dataAtual = `${dia}/${mes}/${ano}`;

  const getNext7Days = (): string[] => {
    const today = new Date();
    const days = [];

    const abbreviatedDays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

    days.push("Hoje");

    for (let i = 1; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const dayIndex = nextDate.getDay();
      days.push(abbreviatedDays[dayIndex]);
    }

    return days;
  };

  const dateLabels = getNext7Days();

  const today = new Date();
  const dataHoje = formatDay(today);


  const fetchWeatherData = async (latitude: number, longitude: number, days: number = 7) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&current_weather=true&timezone=auto&forecast_days=${days}&temperature_unit=celsius`
    );
    const data = await response.json();
    return data;
  };

  const [temperatureData, setTemperatureData] = useState({
    labels: dateLabels,
    datasets: [
      {
        data: [],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
      },
      {
        data: [],
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
      },
    ],
    legend: ["Máxima", "Mínima"],
  });

  const [precipitationData, setPrecipitationData] = useState({
    labels: dateLabels,
    datasets: [
      {
        data: [],
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
      },
    ],
  });

  const [currentTemperature, setCurrentTemperature] = useState<number | null>(null);
  const [maxTemperature, setMaxTemperature] = useState<number | null>(null);
  const [minTemperature, setMinTemperature] = useState<number | null>(null);

  const [selectedLocation, setSelectedLocation] = useState(location);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);


  useEffect(() => {
    const getWeatherData = async () => {
      setLoading(true);
      const data = await fetchWeatherData(
        selectedLocation.latitude,
        selectedLocation.longitude
      );

      const maxTemperatures = (data?.daily?.temperature_2m_max || []).map(
        (value: number) => Math.round(value) || 0
      );
      const minTemperatures = (data?.daily?.temperature_2m_min || []).map(
        (value: number) => Math.round(value) || 0
      );

      setMaxTemperature(Math.max(...maxTemperatures));
      setMinTemperature(Math.min(...minTemperatures));

      setTemperatureData({
        labels: dateLabels,
        datasets: [
          {
            data: maxTemperatures,
            color: () => `rgba(242, 136, 136, 1)`,
          },
          {
            data: minTemperatures,
            color: () => `rgba(90, 172, 207, 1)`,
          },
        ],
        legend: ["Máxima", "Mínima"],
      });

      const precipitationAmounts = (data?.daily?.precipitation_sum || []).map(
        (value: number) => value ?? 0
      );

      setPrecipitationData({
        labels: dateLabels,
        datasets: [
          {
            data: precipitationAmounts,
            color: (opacity = 1) => `rgba(90, 106, 207, ${opacity})`,
          },
        ],
      });

      const currentWeather = data?.current_weather;
      if (currentWeather?.temperature) {
        setCurrentTemperature(Math.round(currentWeather.temperature));
      }

      setLoading(false);
    };

    getWeatherData();
  }, [selectedLocation]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    if (isDropdownOpen) {
      Animated.timing(dropdownOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDropdownOpen(false));
    } else {
      setIsDropdownOpen(true);
      Animated.timing(dropdownOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const [locations, setLocations] = useState<Array<any>>([]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`http://${API_URL}:8080/locations/all`);
      setLocations(response.data);
    } catch (error) {
      console.error("Erro ao buscar localidades:", error);
    }
  };
  const [dropdownOpacity] = useState(new Animated.Value(0));

  const handleLocationSelect = (loc: any) => {
    setSelectedLocation(loc);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  const confirmDelete = () => {
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://${API_URL}:8080/locations/delete/${selectedLocation.id}`);
      setLocations((prevLocations) => prevLocations.filter(location => location.id !== id))
      navigation.navigate("Home");
    } catch (error) {
      console.error("Erro ao deletar o local!", error);
    } finally {
      setIsModalVisible(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
          <View style={styles.dropdownItens}>
            <MaterialIcons name="location-on" size={24} color="black" />
            <Text style={styles.dropdownText}>{selectedLocation.name}</Text>
          </View>
          <Entypo
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
        {isDropdownOpen && (
          <Animated.View
            style={[styles.dropdownMenu, { opacity: dropdownOpacity }]}
          >
            <ScrollView>
              {locations.map((item, index) => (
                <TouchableOpacity
                  key={`${item.name}-${index}`}
                  style={styles.dropdownItem}
                  onPress={() => handleLocationSelect(item)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>

      <View style={styles.temperatureContainer}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', paddingRight: 16, }}>
          <Text style={{ fontWeight: "200", fontSize: 16 }}>Hoje, {dataAtual}</Text>
          <FontAwesome6 name="trash" size={28} color="#D54B4B" onPress={confirmDelete} />
        </View>
        {currentTemperature !== null && (
          <Text style={styles.currentTemperature}>{currentTemperature}°C</Text>
        )}
        {maxTemperature !== null && minTemperature !== null && (
          <Text style={styles.variation}>
            <Text style={{ color: "#000", fontWeight: "200" }}>
              {maxTemperature}°
            </Text>
            <Text style={{ color: "#FF0000" }}>↑</Text>
            <Text style={{ color: "#000", fontWeight: "200" }}>
              {minTemperature}°
            </Text>
            <Text style={{ color: "#007BFF" }}>↓</Text>
          </Text>
        )}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Variação da temperatura</Text>
        <LineChart
          data={temperatureData}
          width={Dimensions.get("window").width - 40}
          height={220}
          yAxisSuffix="°C"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: "0",
              strokeWidth: "2",
              stroke: "#f28c8c",
            },
            propsForBackgroundLines: {
              stroke: "#e3e3e3",
              strokeWidth: 1,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
          }}
          verticalLabelRotation={0}
        />
      </View>

      <View style={styles.barChartContainer}>
        <Text style={styles.sectionTitle}>Pluviometria</Text>
        <BarChart
          data={precipitationData}
          width={Dimensions.get("window").width - 40}
          height={200}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(90, 106, 207, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            barPercentage: 0.5,
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
          }}
          style={{
            marginVertical: 8,
          }}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>Você realmente deseja excluir a localização?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleDelete} style={styles.confirmButton}>
                <Text style={styles.buttonText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    position: "relative",
    marginVertical: 10,
    marginTop: 40,
    marginHorizontal: 10,
  },
  dropdown: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    backgroundColor: "#F7F7F7",
  },
  dropdownItens: {
    display: "flex",
    flexDirection: "row",
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: `200`,
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    zIndex: 1,
    overflow: "hidden",
  },

  dropdownItem: {
    padding: 10,
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  temperatureContainer: {
    alignItems: "flex-start",
    marginLeft: 20,
    marginTop: 10,
  },
  currentTemperature: {
    fontSize: 80,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#D54B4B",
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#909090",
    borderRadius: 5,
    padding: 10,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  variation: {
    fontSize: 18,
    color: "#666",
  },
  chartContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "300",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  barChartContainer: {
    marginVertical: 20,
  },
});

export default Dashboard;
