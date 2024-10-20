import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import Slider from "../components/Slider";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { API_URL } from "@env";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const RegisterLocation: React.FC = () => {
  const [name, setName] = useState("");
  const [cropName, setCropName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tempMin, setTempMin] = useState(0);
  const [tempMax, setTempMax] = useState(50);
  const [pluvMin, setPluvMin] = useState(0);
  const [pluvMax, setPluvMax] = useState(50);
  const [humidityMin, setHumidityMin] = useState(50);
  const [humidityMax, setHumidityMax] = useState(90);
  const [isLatitudeValid, setIsLatitudeValid] = useState(false);
  const [isLongitudeValid, setIsLongitudeValid] = useState(false);
  const [region, setRegion] = useState({
    latitude: -23.162139,
    longitude: -45.795291,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const isValidCoordinate = (value) => {
    const regex = /^-?\d*\.?\d*$/;
    return regex.test(value);
  };

  const handleLatitudeChange = (text) => {
    setLatitude(text);
    const valid = isValidCoordinate(text) && text.length > 1;
    setIsLatitudeValid(valid);
    if (valid) {
      setRegion((prev) => ({ ...prev, latitude: parseFloat(text) }));
    }
  };

  const handleLongitudeChange = (text) => {
    setLongitude(text);
    const valid = isValidCoordinate(text) && text.length > 1;
    setIsLongitudeValid(valid);
    if (valid) {
      setRegion((prev) => ({ ...prev, longitude: parseFloat(text) }));
    }
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude.toString());
    setLongitude(longitude.toString());
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
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
      .post(`http://${API_URL}:8080/locations/create`, data)
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
        <MaterialIcons name="location-pin" size={32} color="#3874CF" />
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
          <Text style={styles.inputTitle}>Localização</Text>
          {/* Mini mapa com preview */}
          <TouchableOpacity
            style={styles.mapPreview}
            onPress={() => setModalVisible(true)}
          >
            <MapView
              style={styles.miniMap}
              region={region}
            >
              {isLatitudeValid && isLongitudeValid && (
                <Marker
                  coordinate={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                  }}
                />
              )}
            </MapView>
          </TouchableOpacity>
          <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ width: "45%" }}>
              <Text style={styles.inputTitle}>Latitude</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={latitude}
                onChangeText={handleLatitudeChange}
              />
            </View>
            <View style={{ width: "45%" }}>
              <Text style={styles.inputTitle}>Longitude</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={longitude}
                onChangeText={handleLongitudeChange}
              />
            </View>
          </View>
          {/* Slider */}
          <View style={{ gap: 4, marginBottom: 4 }}>
            <Text style={styles.inputTitle}>Alerta de temperatura</Text>
            <Slider
              min={0}
              max={50}
              step={1}
              initialMinValue={0}
              initialMaxValue={50}
              onValuesChange={(values) => {
                setTempMin(values[0]);
                setTempMax(values[1]);
              }}
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
              onValuesChange={(values) => {
                setPluvMin(values[0]);
                setPluvMax(values[1]);
              }}
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

      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={30} color="#3874CF" />
            </TouchableOpacity>
            <MapView
              style={styles.map}
              region={region}
              onPress={handleMapPress}
            >
              {isLatitudeValid && isLongitudeValid && (
                <Marker
                  coordinate={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                  }}
                />
              )}
            </MapView>

            <View style={styles.latLonContainer}>
              <TextInput
                style={styles.inputModal}
                keyboardType="numeric"
                placeholder="Latitude"
                value={latitude}
                onChangeText={handleLatitudeChange}
              />
              <TextInput
                style={styles.inputModal}
                keyboardType="numeric"
                placeholder="Longitude"
                value={longitude}
                onChangeText={handleLongitudeChange}
              />
            </View>
            <TouchableOpacity style={styles.buttonMap} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "200",
    color: "#000",
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
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 8,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#3874CF",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  buttonMap: {
    backgroundColor: "#3874CF",
    width: '100%',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  mapPreview: {
    height: 150,
    borderColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  miniMap: {
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    justifyContent: "space-between",
    overflow: "hidden",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: '70%',
    borderRadius: 8,
  },
  latLonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  inputModal: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    padding: 8,
    borderRadius: 6,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
});
