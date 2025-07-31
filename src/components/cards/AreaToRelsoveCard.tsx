import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { s, vs } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

export default function AreaToRelsoveCard({
  imageUrl,
  title,
  description,
  navigateTo,
}) {
  const navigation = useNavigation();
  // console.log(imageUrl);
  const handlePress = () => {
    if (!navigateTo) return;
    navigation.navigate("ServicesStack", {
      screen: navigateTo,
    });
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View style={styles.card}>
        <Image source={{uri: imageUrl}} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        {/* <Text style={styles.description}>{description}</Text> */}
        <Pressable style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Ver más</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // width: "90%",
    height: 250,
    marginVertical: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginRight: 10,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 75,
    resizeMode: "cover",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    width: "100%",
    textAlign: "center",
    marginBottom: 6,
    color: "#333",
  },
  description: {
    fontSize: 14,
    width: "100%",
    textAlign: "center",
    color: "#666",
    marginBottom: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  buttonText: {
    color: "#0074D9",
    fontWeight: "600",
  },
});
