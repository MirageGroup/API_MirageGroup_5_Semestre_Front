import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@env";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(`http://${API_URL}:8080/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: email,
          password: password,
        }),
      });

      if (response.status === 200) {
        onLogin();
      } else if (response.status === 401) {
        Alert.alert("Erro", "Credenciais inválidas.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro. Tente novamente mais tarde.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.stretch}
        source={require("../../assets/weather.png")}
      />

      <Text style={styles.title}>ClimaMonitor</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail-outline"
          size={20}
          color="#666"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="e-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color="#666"
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Ionicons
            name={passwordVisible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#666"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.linkText}>Primeiro acesso</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
    width: "100%",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  stretch: {
    width: 80,
    height: 80,
    resizeMode: "stretch",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#4da6ff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#4da6ff",
    marginTop: 20,
    textDecorationLine: "none",
  },
});

export default Login;
