import React, { useState } from "react";
import { View, StyleSheet, Text, Image, TextInput, TouchableOpacity, } from "react-native";
import Slider from "../components/Slider";



const RegisterLocation: React.FC = () => {
    const [tempMin, setTempMin] = useState(0);
    const [tempMax, setTempMax] = useState(50);
    const [pluvMin, setPluvMin] = useState(0);
    const [pluvMax, setPluvMax] = useState(50);


    const handleTempValuesChange = (values: number[]) => {
        setTempMin(values[0]);
        setTempMax(values[1]);
    };

    const handlePluvValuesChange = (values: number[]) => {
        setPluvMin(values[0]);
        setPluvMax(values[1]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleArea}>
                <Image style={styles.iconTitle} source={require('../../assets/location.png')} />
                <Text style={styles.title}>Registrar um novo local</Text>
            </View>
            <View style={styles.formContainer}>
                <View >
                    <Text style={styles.inputTitle}>Nome</Text>
                    <TextInput style={styles.input}/>
                </View>
                <View >
                    <Text style={styles.inputTitle}>Nome do cultivo (opcional)</Text>
                    <TextInput style={styles.input}/>
                </View>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between'}} >
                    <View style={{ width: '45%'}}>
                        <Text style={styles.inputTitle}>Longitude</Text>
                        <TextInput style={styles.input} keyboardType="numeric"/>
                    </View>
                    <View style={{ width: '45%'}}>
                        <Text style={styles.inputTitle}>Latitude</Text>
                        <TextInput style={styles.input} keyboardType="numeric"/>
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
                    <Text style={styles.inputTitle}>Alerta de pluviometria</Text>
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
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}

export default RegisterLocation;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 80,
      gap: 10,
    },

    titleArea: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 12,
        paddingHorizontal: 8,
      },
    title: {
        fontSize: 20,
        fontWeight: '300',
        color: '#000000',
    },
    iconTitle: {
        width: 36,
        height: 36,
        resizeMode: 'stretch',
    },
    formContainer: {
        width: '100%',
        justifyContent: 'flex-start',
        marginTop: 15,
        gap: 16,
        paddingHorizontal: 8,  
    },
    inputTitle: {
        color: '#3874CF',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#808080',
        borderRadius: 8,
        paddingVertical: 8,
        height: 36,
        paddingHorizontal: 8,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#3874CF',
        borderRadius: 5,
        paddingVertical: 12,
        width: '100%',
        alignItems: 'center',

    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    }
});