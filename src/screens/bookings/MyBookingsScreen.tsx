import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function MyBookingsScreen() {
  const auth = getAuth();
  const db = getFirestore();
  const nav = useNavigation<any>();
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const q = query(
      collection(db, "bookings"),
      where("customerUid", "==", uid),
      orderBy("createdAt","desc")
    );
    const unsub = onSnapshot(q, snap => {
      setRows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={styles.h1}>Mis servicios contratados</Text>

      {rows.length === 0 ? (
        <View style={{ padding:16, alignItems:"center" }}>
          <Text style={{ color:"#5E7283", textAlign:"center" }}>
            Aún no has contratado servicios. Cuando lo hagas, aparecerán aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(it)=> it.bookingId || it.id}
          renderItem={({item})=>(
            <TouchableOpacity style={styles.card} onPress={()=> nav.navigate("BookingDetail", { bookingId: item.bookingId })}>
              <Text style={styles.title}>{item.serviceTitle}</Text>
              <Text style={styles.row}>Estado: {item.status}</Text>
              {item.requested && (
                <Text style={styles.row}>
                  Propuesto: {item.requested.date} · {item.requested.start}-{item.requested.end}
                </Text>
              )}
              {item.scheduled && (
                <Text style={styles.row}>
                  Agendado: {item.scheduled.date} · {item.scheduled.start}-{item.scheduled.end}
                </Text>
              )}
              <Text style={styles.row}>Total: ${(item.amounts?.total||0).toLocaleString("es-CL")}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  h1:{ fontSize:20, fontWeight:"800", marginBottom:12 },
  card:{ backgroundColor:"#fff", borderRadius:12, borderWidth:1, borderColor:"#E2EDF6", padding:12, marginBottom:10 },
  title:{ fontWeight:"800", marginBottom:4 },
  row:{ marginTop:2, color:"#102331" },
});
