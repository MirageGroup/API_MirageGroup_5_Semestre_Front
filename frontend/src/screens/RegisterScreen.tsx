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
import { NavigationProp, useNavigation } from "@react-navigation/native";


type StackParamList = {
    Login: undefined;
};



const Register: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const navigation = useNavigation<NavigationProp<StackParamList>>();
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Erro", "Por favor, insira um e-mail válido.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        try {
            console.log(`http://${API_URL}:8080/user/create`)
            const response = await fetch(`http://${API_URL}:8080/user/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: email,
                    password: password,
                }),
            })
            if (response.status === 201) {
                navigation.navigate("Login");
            } else if (response.status === 401) {
                Alert.alert("Erro", "Credenciais inválidas.");
            } else {
                Alert.alert("Erro", "Ocorreu um erro. Tente novamente mais tarde.");
            }
        } catch (error) {
            
            console.error("Erro ao Registrar usuario:", error);
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
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
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
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
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

            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar Senha"
                    placeholderTextColor="#999"
                    secureTextEntry={!confirmPasswordVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                    <Ionicons
                        name={confirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#666"
                        style={styles.eyeIcon}
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Cadastrar Usuário</Text>
            </TouchableOpacity>
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
});

export default Register;
