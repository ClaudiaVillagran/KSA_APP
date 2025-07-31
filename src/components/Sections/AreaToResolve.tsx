import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { AreasToResolve } from "../../data/AreasToResolve";
import AreaToRelsoveCard from "../../components/cards/AreaToRelsoveCard";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setAreas } from "../../store/reducers/areaSlice";
import { RootState } from "../../store/store";
export default function AreaToResolve() {
  const {areas} =  useSelector((state: RootState) => state.areaSlice);
  // console.log("from area",areas);
  // console.log("from areas to resolve",areas[1]);
 

  return (
    <View style={styles.containerArea}>
      <Text style={styles.title}>Áreas que resolvemos</Text>

      <FlatList
        horizontal={true}
        data={areas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AreaToRelsoveCard
            imageUrl={item.imageUrl}
            title={item.name}
            description={item.description}
            navigateTo={item.screen}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerArea: {
    minHeight: 200,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
  },
});
