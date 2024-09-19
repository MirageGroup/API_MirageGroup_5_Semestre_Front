import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as React from 'react';
import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';


interface SliderProps {
    min?: number;
    max?: number;
    step?: number;
    initialMinValue?: number;
    initialMaxValue?: number;
    onValuesChange?: (values: number[]) => void;
    labelLeft?: string;
    labelRight?: string;
    unit?: string;
}

const Slider: React.FC<SliderProps> = ({
    min = 0,
    max = 100,
    step = 1,
    initialMinValue = min,
    initialMaxValue = max,
    onValuesChange,
    labelLeft = 'Min',
    labelRight = 'Max',
    unit = '',
}) => {
    const [minValue, setMinValue] = useState(initialMinValue);
    const [maxValue, setMaxValue] = useState(initialMaxValue);

    const handleValuesChange = (values: number[]) => {
        setMinValue(values[0]);
        setMaxValue(values[1]);
        if(onValuesChange) {
            onValuesChange(values);
        }
    };

    

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.labels}>
        <Text style={styles.label}>{labelLeft}</Text>
        <Text style={styles.label}>{labelRight}</Text>
      </View>
      <MultiSlider
        values={[minValue, maxValue]}
        min={min}
        max={max}
        step={step}
        sliderLength={330}
        onValuesChange={handleValuesChange}
        selectedStyle={styles.sliderFront}
        unselectedStyle={styles.sliderBack}
        customMarker={() => <View style={styles.thumb} />}
        />
      <View style={styles.values}>
        <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{minValue}{unit}</Text>
        </View>
        <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{maxValue}{unit}</Text>
        </View>
      </View>
    </View>
    
  );
};

export default Slider;

const styles = StyleSheet.create({
    sliderContainer:{
        justifyContent: 'center',
        alignSelf: 'center',
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: -8,
    },
    label: {
        fontSize: 13,
        color: '#3874CF',
        fontWeight: '300',
    },
    sliderFront: {
        height: 12,
        backgroundColor: '#3874CF',
        borderRadius: 20,
    },
    sliderBack: {
        height: 12,
        backgroundColor: '#DDDDDD',
        borderRadius: 20,
    },
    thumb: {
        marginTop: 10,
        height: 25,
        width: 25,
        borderRadius: 12.5,
        backgroundColor: '#4A90E2',
        borderWidth: 4,
        borderColor: '#FFF',
        elevation: 4,
    },
    values: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    valueText: {
        color: '#000000',
        width: 45,
        height: 25,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontWeight: '300',
        fontSize: 13,
    },
    valueContainer: {
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
    },
});
