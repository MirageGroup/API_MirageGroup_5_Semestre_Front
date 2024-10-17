import { MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import axios from "axios";
import { ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
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

const Dashboard: React.FC<{ route: any }> = ({ route }) => {
  const { location } = route.params;
  const { latitude, longitude, name } = location;

  const getData = new Date();
  const dia = getData.getDate();
  const mes = getData.getMonth() + 1;
  const ano = getData.getFullYear();
  const dataHoje = `${dia}/${mes}/${ano}`;

  const fetchWeatherData = async (
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string
  ) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&temperature_unit=celsius&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&current_weather=true&timezone=auto`
    );
    const data = await response.json();
    return data;
  };

  const [temperatureData, setTemperatureData] = useState({
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [
      {
        data: [25, 27, 28, 29, 30, 32, 31].map((value) => value || 0),
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
      },
      {
        data: [18, 19, 20, 21, 22, 23, 24].map((value) => value || 0),
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
      },
    ],
    legend: ["Máxima", "Mínima"],
  });

  const [precipitationData, setPrecipitationData] = useState({
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
      },
    ],
  });

  const [currentTemperature, setCurrentTemperature] = useState<number | null>(
    null
  );
  const [maxTemperature, setMaxTemperature] = useState<number | null>(null);
  const [minTemperature, setMinTemperature] = useState<number | null>(null);

  const startDate = "2024-10-14";
  const endDate = "2024-10-28";

  const [selectedLocation, setSelectedLocation] = useState(location);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeatherData = async () => {
      setLoading(true);
      const data = await fetchWeatherData(
        selectedLocation.latitude, 
        selectedLocation.longitude, 
        startDate,
        endDate
      );

      const maxTemperatures = (data?.daily?.temperature_2m_max || []).map(
        (value) => Math.round(value) || 0
      );
      const minTemperatures = (data?.daily?.temperature_2m_min || []).map(
        (value) => Math.round(value) || 0
      );

      const currentWeather = data?.current_weather;
      const currentTemp = currentWeather?.temperature;

      const roundedCurrentTemp = Math.round(currentTemp);

      setCurrentTemperature(roundedCurrentTemp);
      setMaxTemperature(Math.max(...maxTemperatures));
      setMinTemperature(Math.min(...minTemperatures));

      setTemperatureData({
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
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
        (value) => value ?? 0
      );

      setPrecipitationData({
        labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        datasets: [
          {
            data: precipitationAmounts,
            color: (opacity = 1) => `rgba(90, 106, 207, ${opacity})`,
          },
        ],
      });
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
      const response = await axios.get(
        `http://${API_URL}:8080/locations/all`
      );
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
        <Text style={{ fontWeight: "200" }}>Hoje, {dataHoje}</Text>
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
