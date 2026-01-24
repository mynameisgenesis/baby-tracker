import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    label: string;
}

export default function Button({label}: Props){
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>{label}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        marginVertical: 10,
        width: '80%',
    },
    button: {
        backgroundColor: '#967bb6',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#d3d3ff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonLabel: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    buttonIcon: {
      marginRight: 8,
    },
});