import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import AvailableProductsCard from "../../components/cards/AvailableProductsCard";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../store/reducers/cartSlice";

type Props = {
  /** IDs de servicios a mostrar, en el ORDEN que quieres renderizarlos */
  featuredIds: string[];
  title?: string;
  horizontal?: boolean;
};

export default function FeaturedServices({
  featuredIds,
  title = "Servicios destacados",
  horizontal = true,
}: Props) {
  const dispatch = useDispatch();
  const { areas } = useSelector((state: RootState) => state.areaSlice);

  // 1) Aplana TODA la matriz de productos sin duplicados
  const allProducts = useMemo(() => {
    const acc: any[] = [];
    const seen = new Set<string>();

    areas.forEach((area) => {
      area.categories?.forEach((category: any) => {
        category.products?.forEach((product: any) => {
          if (product?.id && !seen.has(product.id)) {
            seen.add(product.id);
            acc.push(product);
          }
        });
      });
    });

    return acc;
  }, [areas]);

  // 2) Crea un Map para ordenamiento según featuredIds
  const orderMap = useMemo(() => {
    const m = new Map<string, number>();
    featuredIds.forEach((id, idx) => m.set(id, idx));
    return m;
  }, [featuredIds]);

  // 3) Filtra SOLO destacados y ordénalos según featuredIds
  const featuredProducts = useMemo(() => {
    const setIds = new Set(featuredIds);
    return allProducts
      .filter((p) => setIds.has(p.id))
      .sort((a, b) => (orderMap.get(a.id)! - orderMap.get(b.id)!));
  }, [allProducts, featuredIds, orderMap]);

  // console.log(featuredProducts);
  if (!featuredProducts.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.helperText}>
          Aún no hay servicios destacados para mostrar.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal={horizontal}
        data={featuredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AvailableProductsCard
            imageUrl={item.image}
            title={item.title}
            price={item.price}
            author={item.ownerName}
            onAddToCartPress={() => dispatch(addItemToCart(item))}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 16,
    marginBottom: 12,
    color: "#222",
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  helperText: {
    marginLeft: 16,
    color: "#666",
  },
});
