import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const features = [
    "Alcance y visibilidad",
    "Soporte al cliente",
    "KSA Networking",
    "KSA Community",
    "KSA Marketing",
    "KSA Academy",
    "KSA Showcases",
];

const plans = {
    Básico: [true, true, false, false, false, false, false],
    Pro: [true, true, true, true, false, false, false],
    Premium: [true, true, true, true, true, true, true],
};

export default function PlanTable() {
    return (
        <ScrollView horizontal style={styles.wrapper}>
            <View style={styles.table}>
                {/* Encabezado */}
                <View style={styles.row}>
                    <View style={styles.featureCell}>
                        <Text style={[styles.headerText]}>Características</Text>
                    </View>
                    {Object.keys(plans).map((plan, i) => (
                        <View key={i} style={styles.planCell}>
                            <Text style={styles.headerText}>{plan}</Text>
                        </View>
                    ))}
                </View>

                {/* Filas de contenido */}
                {features.map((feature, i) => (
                    <View key={i} style={styles.row}>
                        <View style={styles.featureCell}>
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                        {Object.values(plans).map((planData, j) => (
                            <View key={j} style={styles.planCell}>
                                <Text style={styles.checkText}>{planData[i] ? "✔" : "—"}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 24,
    },
    table: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },
    featureCell: {
        width: 180,
        padding: 12,
        justifyContent: 'center',
        backgroundColor: '#f0f4ff',
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    planCell: {
        width: 100,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
        color: "#007BFF",
    },
    featureText: {
        fontSize: 14,
        color: "#333",
    },
    checkText: {
        fontSize: 16,
        color: "#007BFF",
    },
});
