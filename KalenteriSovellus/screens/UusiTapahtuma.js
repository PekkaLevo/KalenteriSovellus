// Importit
import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TextInput, Alert } from "react-native";
import { insertEvent } from "../db/eventsDb";
import { geocodeAddress } from "../utils/geokoodi";

/*
  UusiTapahtuma-näkymä:
  - näyttää lomakkeen uuden tapahtuman lisäämistä varten
  - saa kalenterista valitun päivän route.params.paiva:na
*/

export default function UusiTapahtuma({ route, navigation }) {
  const paiva = route.params?.paiva || ""; // päivä kalenterista (voi olla tyhjä)
  const [otsikko, setOtsikko] = useState("");
  const [aika, setAika] = useState("");
  const [osoite, setOsoite] = useState("");
  const [kuvaus, setKuvaus] = useState("");

  const tallenna = async () => {
    if (!otsikko.trim() || !paiva || !aika.trim() || !osoite - trim()) {
      Alert.alert("Virhe", "Täytä kaikki kentät.");
      return;
    }

    try {
      // Geokoodataan osoite → lat/lon
      const geo = await geocodeAddress(osoite.trim());

      const event = {
        otsikko: otsikko.trim(),
        paiva,
        aika: aika.trim(),
        osoite: osoite.trim(),
        lat: geo?.lat ?? null,
        lon: geo?.lon ?? null,
        kuvaus: kuvaus.trim() || null,
      };

      await insertEvent(event);
      navigation.goBack(); // palaa Tapahtumat-näkymään
    } catch (e) {
      console.error("Tapahtuman tallennus epäonnistui", e);
      Alert.alert("Virhe", "Tapahtuman tallennus epäonnistui.");
    }
    console.log({ otsikko, paiva, aika, osoite, kuvaus });
  };

  // Näytetään lomake ja tallennuspainike
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Päivä: {paiva || "-"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Otsikko"
        value={otsikko}
        onChangeText={setOtsikko}
      />
      <TextInput
        style={styles.input}
        placeholder="Aika (esim. 14:30)"
        value={aika}
        onChangeText={setAika}
      />
      <TextInput
        style={styles.input}
        placeholder="Osoite"
        value={osoite}
        onChangeText={setOsoite}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Kuvaus (valinnainen)"
        value={kuvaus}
        onChangeText={setKuvaus}
        multiline
      />

      <Button title="Tallenna" onPress={tallenna} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { marginBottom: 8, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
});
