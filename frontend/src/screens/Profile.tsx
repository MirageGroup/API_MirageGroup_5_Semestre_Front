import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Animated } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Profile: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(require("../../assets/profile-user-icon.jpg"));

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
  const handleImageSelection = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "Precisamos da sua permissão para acessar as fotos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage({ uri: result.assets[0].uri });
    }
  };

  const handleLogout = () => {

  }

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
          <TouchableOpacity style={styles.dropdownItem}>
            <Ionicons name="trash" size={20}/>
            <Text style={styles.dropdownText}>Excluir perfil</Text>
          </TouchableOpacity>
        </Animated.View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <TextInput editable={false} style={styles.name}>User Name</TextInput>
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
            <TextInput editable={false} style={styles.input}/>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Sair da conta</Text>
        </TouchableOpacity>
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
    marginTop: 40,
  },
  name: {
    fontSize: 36,
    fontWeight: "300",
    color: "#2D2D2D",
    marginBottom: 60,
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
    marginTop: 10,
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
  logoutButton: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#4da6ff",
    fontSize: 16,
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