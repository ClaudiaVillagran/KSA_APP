import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import CompanyCard from "./CompanyCard";
import {
  loadFeaturedCompanies,
  subscribeFeaturedCompanies,
} from "../../store/actions/companyActions";
import { useNavigation } from "@react-navigation/native";

// (Opcional) Skeleton simple sin archivo extra
function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <View style={[styles.skelLogo]} />
      <View style={[styles.skelLine, { width: "70%" }]} />
      <View style={[styles.skelLine, { width: "50%" }]} />
      <View style={[styles.skelLine, { width: "90%", marginTop: 8 }]} />
      <View style={[styles.skelBtns]}>
        <View style={[styles.skelBtn]} />
        <View style={[styles.skelBtn, { width: 80 }]} />
      </View>
    </View>
  );
}

export default function FeaturedCompanies() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { companies, loading } = useSelector((s: RootState) => s.companySlice);
  const unsubRef = useRef<null | (() => void)>(null);

  console.log("companies", companies);
  useEffect(() => {
    const unsub = dispatch(
      subscribeFeaturedCompanies(10)
    ) as unknown as () => void;
    unsubRef.current = unsub;

    // Limpia la suscripción al desmontar la pantalla
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [dispatch]);

  // const dispatch = useDispatch<AppDispatch>();
  // const { companies, loading } = useSelector((s: RootState) => s.companySlice);

  // const onRefresh = () => {
  //   dispatch(loadFeaturedCompanies(10));
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Empresas destacadas</Text>

      {loading ? (
        <FlatList
          horizontal
          data={[1, 2, 3]}
          keyExtractor={(k) => String(k)}
          renderItem={() => <SkeletonCard />}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : companies && companies.length > 0 ? (
        <FlatList
          horizontal
          data={companies}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            // FeaturedCompanies.tsx (dentro de renderItem)
            <CompanyCard
              name={item.name}
              logo={item.logo}
              rating={item.rating}
              totalProducts={(item as any).totalProducts ?? 0}
              tags={item.tags}
              description={item.shortDescription}
              onOpenProfile={() =>
                navigation.navigate("CompanyProfile", { companyId: item.id })
              }
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      ) : (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ color: "#666" }}>
            Aún no hay empresas destacadas publicadas.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 20, backgroundColor: "#f9f9f9" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 16,
    marginBottom: 12,
    color: "#222",
  },
  listContent: { paddingLeft: 16, paddingRight: 8 },

  // Skeleton styles
  skeletonCard: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  skelLogo: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#e9eef4",
    marginBottom: 10,
  },
  skelLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e9eef4",
    marginTop: 6,
  },
  skelBtns: { flexDirection: "row", gap: 8, marginTop: 12 },
  skelBtn: {
    height: 40,
    borderRadius: 10,
    backgroundColor: "#e9eef4",
    flex: 1,
  },
});
