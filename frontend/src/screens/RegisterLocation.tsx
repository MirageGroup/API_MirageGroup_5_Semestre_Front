import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Slider from "../components/Slider";
import axios from "axios";

const RegisterLocation: React.FC = () => {
  const [name, setName] = useState("");
  const [cropName, setCropName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [tempMin, setTempMin] = useState(0);
  const [tempMax, setTempMax] = useState(50);
  const [pluvMin, setPluvMin] = useState(0);
  const [pluvMax, setPluvMax] = useState(50);
  const [humidityMin, setHumidityMin] = useState(50);
  const [humidityMax, setHumidityMax] = useState(90);

  const handleTempValuesChange = (values: number[]) => {
    setTempMin(values[0]);
    setTempMax(values[1]);
  };

  const handlePluvValuesChange = (values: number[]) => {
    setPluvMin(values[0]);
    setPluvMax(values[1]);
  };

  const handleSubmit = async () => {
    const data = {
      name,
      crop_name: cropName,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      temperature_min: tempMin,
      temperature_max: tempMax,
      rainfall_min: pluvMin,
      rainfall_max: pluvMax,
      humidity_min: humidityMin,
      humidity_max: humidityMax,
    };
    console.log(data);

    await axios
      .post("http://seuipv4:8080/locations/create", data)
      .then((response) => {
        console.log("console log response:", response);
        Alert.alert("Sucesso", "Local registrado com sucesso!");

        setName("");
        setCropName("");
        setLatitude("");
        setLongitude("");
        setTempMin(0);
        setTempMax(50);
        setPluvMin(0);
        setPluvMax(50);
        setHumidityMin(50);
        setHumidityMax(90);
      })
      .catch((error) => {
        console.error("Erro ao registrar local:", error);
        Alert.alert("Erro", "Não foi possível registrar o local.");
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleArea}>
        <MaterialIcons name="location-on" size={32} color="#3874CF" />
        <Text style={styles.title}>Registrar um novo local</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <View>
            <Text style={styles.inputTitle}>Nome do local</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View>
            <Text style={styles.inputTitle}>Nome do cultivo (opcional)</Text>
            <TextInput
              style={styles.input}
              value={cropName}
              onChangeText={setCropName}
            />
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "45%" }}>
              <Text style={styles.inputTitle}>Longitude</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={longitude}
                onChangeText={setLongitude}
              />
            </View>
            <View style={{ width: "45%" }}>
              <Text style={styles.inputTitle}>Latitude</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={latitude}
                onChangeText={setLatitude}
              />
            </View>
          </View>
          <View style={{ gap: 4, marginBottom: 4 }}>
            <Text style={styles.inputTitle}>Alerta de temperatura</Text>
            <Slider
              min={0}
              max={50}
              step={1}
              initialMinValue={0}
              initialMaxValue={50}
              onValuesChange={handleTempValuesChange}
              labelLeft="Temp Min"
              labelRight="Temp Máx"
              unit="°C"
            />
          </View>
          <View style={{ gap: 4, marginBottom: 4 }}>
            <Text style={styles.inputTitle}>Alerta de umidade</Text>
            <Slider
              min={0}
              max={100}
              step={1}
              initialMinValue={0}
              initialMaxValue={100}
              onValuesChange={handlePluvValuesChange}
              labelLeft="Pluv Min"
              labelRight="Pluv Máx"
              unit="%"
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RegisterLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  scrollView: {
    flex: 1,
    alignContent: "stretch",
  },
  titleArea: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 8,
    marginTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "300",
    color: "#000000",
  },
  iconTitle: {
    width: 36,
    height: 36,
    resizeMode: "stretch",
  },
  formContainer: {
    width: "100%",
    justifyContent: "flex-start",
    marginTop: 15,
    gap: 16,
    paddingHorizontal: 8,
  },
  inputTitle: {
    color: "#3874CF",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 8,
    paddingVertical: 8,
    height: 36,
    paddingHorizontal: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#3874CF",
    borderRadius: 5,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
