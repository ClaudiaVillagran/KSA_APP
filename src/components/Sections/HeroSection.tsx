import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { vs } from "react-native-size-matters";

export default function HeroSection() {
  return (
    <View
      style={{
        height: vs(128),
        width: "100%",
        justifyContent: "flex-start",
      }}
    >
      <Image
        style={{ height: "100%", width: "100%", resizeMode: "stretch" }}
        source={require("../../assets/img/bannerInicio.webp")}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
