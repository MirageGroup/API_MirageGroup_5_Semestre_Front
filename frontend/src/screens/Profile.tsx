import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Animated } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

interface LogoutProps {
  onLogout: () => void;
}
const Profile: React.FC<LogoutProps> = ({ onLogout }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(require("../../assets/profile-user-icon.jpg"));
  const [name, setName] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownOpacity] = useState(new Animated.Value(0));
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


  useEffect(() => {
    const fetchImage = async () => {
      const savedImageUri = await AsyncStorage.getItem('profileImageUri');
      if (savedImageUri) {
        setSelectedImage({ uri: savedImageUri });
      }
    };

    fetchImage();
  }, []);
  const handleImageSelection = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "Precisamos da sua permissão para acessar as fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage({ uri });
      await AsyncStorage.setItem('profileImageUri', uri);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('profileImageUri');
    onLogout();
  }

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://${API_URL}:8080/user/getprofile/${userId}`);
          const data = await response.json();
          setName(data.name);
          setUserName(data.user);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      };
  
      fetchUserData();
    }
  }, [userId]);

  const handleDeleteProfile = async () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Exclusão cancelada"),
          style: "cancel", 
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              const response = await fetch(`http://${API_URL}:8080/user/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
  
              if (response.ok) {
                handleLogout();
                Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso");
              } else {
                console.error("Erro ao excluir o perfil");
              }
            } catch (error) {
              console.error("Erro ao deletar o perfil!", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.blueBackground}/>
      <View style={styles.menuBar}>
        <TouchableOpacity onPress={toggleDropdown}>
          <Ionicons name="ellipsis-vertical" size={24}/>
        </TouchableOpacity>
        {isDropdownOpen && (
          <Animated.View
          style={[styles.dropdownMenu, { opacity: dropdownOpacity }]}
        >
          <TouchableOpacity style={styles.dropdownItem} onPress={handleDeleteProfile}>
            <Ionicons name="trash" size={20}/>
            <Text style={styles.dropdownText}>Excluir perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
            <Ionicons name="exit" size={20}/>
            <Text style={styles.dropdownText}>Sair da conta</Text>
          </TouchableOpacity>
        </Animated.View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <TextInput editable={false} style={styles.name}>{name}</TextInput>
          <TouchableOpacity onPress={handleImageSelection}>
            <Image style={styles.profileImage} source={selectedImage} />
            <View style={styles.iconCamera}>
              <MaterialIcons
                name='photo-camera'
                size={25}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.title}>E-mail</Text>
          <View style={styles.inputContainer}>
            <TextInput editable={false} style={styles.input}>{userName}</TextInput>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    alignItems: "center",
    marginBottom: 30,
    marginTop: 30,
  },
  name: {
    fontSize: 42,
    fontWeight: "300",
    color: "#2D2D2D",
    marginBottom: 50,
  },
  profileImage: {
    width: 170,
    height: 170,
    borderRadius: 100,
  },
  iconCamera: {
    position: "absolute",
    bottom: 0,
    right: 10,
    zIndex: 9999,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 15,
    marginBottom: 10,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  menuBar: {
    alignSelf: "flex-end",
    marginTop: 20,
  },
  dropdownMenu: {
    position: "absolute",
    top: 30,
    alignSelf: "flex-end",
    backgroundColor: "#F7F7F7",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    zIndex: 1,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    padding: 10,
    margin: 5,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 10,
  },
});

export default Profile