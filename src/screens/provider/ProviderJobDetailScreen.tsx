import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { providerAcceptBooking, providerScheduleBooking } from "../services/providerActions";

export default function ProviderJobDetailScreen() {
  const route = useRoute<any>();
  const { bookingId } = route.params || {};
  const auth = getAuth();
  const db = getFirestore();
  const [b, setB] = useState<any>(null);
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(()=>{
    if (!bookingId) return;
    const unsub = onSnapshot(doc(db, "bookings", bookingId), snap => setB(snap.data()));
    return unsub;
  },[bookingId]);

  if (!b) return <View style={{padding:16}}><Text>Cargando…</Text></View>;

  const onAccept = async () => {
    try {
      const providerUid = auth.currentUser?.uid!;
      await providerAcceptBooking(bookingId, providerUid);
      Alert.alert("Listo", "Has aceptado el trabajo.");
    } catch (e:any) {
      Alert.alert("Error", e?.message ?? "No se pudo aceptar");
    }
  };

  const onSchedule = async () => {
    try {
      if (!date || !start || !end) {
        Alert.alert("Faltan datos", "Completa fecha y horario.");
        return;
      }
      const providerUid = auth.currentUser?.uid!;
      await providerScheduleBooking(bookingId, providerUid, { date, start, end });
      Alert.alert("Agendado", "Se notificó al cliente.");
    } catch (e:any) {
      Alert.alert("Error", e?.message ?? "No se pudo agendar");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding:16 }}>
      <Text style={styles.h1}>{b.serviceTitle}</Text>
      <Text style={styles.row}>Estado: {b.status}</Text>
      <Text style={styles.row}>Cliente: {b.contact?.name} · {b.contact?.phone}</Text>
      <Text style={styles.row}>Dirección: {b.address}</Text>

      {b.requested && (
        <Text style={styles.row}>
          Cliente propuso: {b.requested.date} · {b.requested.start}-{b.requested.end}
        </Text>
      )}
      {b.scheduled && (
        <Text style={styles.row}>
          Agendado: {b.scheduled.date} · {b.scheduled.start}-{b.scheduled.end}
        </Text>
      )}

      {b.status === "pending_provider" && (
        <TouchableOpacity style={[styles.cta, {backgroundColor:"#28a745"}]} onPress={onAccept}>
          <Text style={styles.ctaText}>Aceptar</Text>
        </TouchableOpacity>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Agendar cita</Text>
        <TextInput style={styles.input} placeholder="Fecha (YYYY-MM-DD)" value={date} onChangeText={setDate} />
        <TextInput style={styles.input} placeholder="Hora inicio (HH:mm)" value={start} onChangeText={setStart} />
        <TextInput style={styles.input} placeholder="Hora fin (HH:mm)" value={end} onChangeText={setEnd} />
        <TouchableOpacity style={[styles.cta, {backgroundColor:"#3BA7E1"}]} onPress={onSchedule}>
          <Text style={styles.ctaText}>Confirmar agenda</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Historial</Text>
        {(b.events||[]).map((e:any,i:number)=>(
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
  cardTitle:{ fontWeight:"800", marginBottom:8 },
  input:{ borderWidth:1, borderColor:"#E2EDF6", borderRadius:10, padding:10, marginTop:8, backgroundColor:"#fff" },
  cta:{ padding:12, borderRadius:10, alignItems:"center", marginTop:12 },
  ctaText:{ color:"#fff", fontWeight:"800" },
});
