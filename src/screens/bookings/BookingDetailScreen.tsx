import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

export default function BookingDetailScreen() {
  const route = useRoute<any>();
  const { bookingId } = route.params || {};
  const db = getFirestore();
  const [b, setB] = useState<any>(null);

  useEffect(()=>{
    if (!bookingId) return;
    const unsub = onSnapshot(doc(db, "bookings", bookingId), snap => setB(snap.data()));
    return unsub;
  },[bookingId]);

  if (!b) return <View style={{padding:16}}><Text>Cargando…</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ padding:16 }}>
      <Text style={styles.h1}>{b.serviceTitle}</Text>
      <Text style={styles.row}>Estado: {b.status}</Text>
      <Text style={styles.row}>Proveedor: {b.providerName || "—"}</Text>
      <Text style={styles.row}>Dirección: {b.address}</Text>

      {b.requested && (
        <Text style={styles.row}>Propuesto: {b.requested.date} · {b.requested.start}-{b.requested.end}</Text>
      )}
      {b.scheduled && (
        <Text style={styles.row}>Agendado: {b.scheduled.date} · {b.scheduled.start}-{b.scheduled.end}</Text>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Historial</Text>
        {(b.events||[]).map((e:any, i:number)=>(
          <Text key={i} style={styles.row}>
            {new Date(e.ts).toLocaleString()} — {e.status}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h1:{ fontSize:20, fontWeight:"800", marginBottom:12 },
  row:{ marginTop:6, color:"#102331" },
  card:{ backgroundColor:"#fff", borderWidth:1, borderColor:"#E2EDF6", borderRadius:12, padding:12, marginTop:12 },
  cardTitle:{ fontWeight:"800", marginBottom:8 }
});
