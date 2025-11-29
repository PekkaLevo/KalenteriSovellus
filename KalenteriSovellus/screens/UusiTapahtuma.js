// Importit
import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TextInput, Alert } from "react-native";
import { insertEvent } from "../db/eventsDb";
import { geocodeAddress } from "../utils/geocode";
import { scheduleEventNotification } from "../utils/notifications";

/*
  UusiTapahtuma-näkymä:
  - näyttää lomakkeen uuden tapahtuman lisäämistä varten
  - saa kalenterista valitun päivän route.params.paiva:na
*/

export default function UusiTapahtuma({ route, navigation }) {
  const getToday = () => new Date().toISOString().slice(0, 10);

  const alkuPaiva = route.params?.paiva || getToday();
  const [paiva, setPaiva] = useState(alkuPaiva);
  const [otsikko, setOtsikko] = useState("");
  const [aika, setAika] = useState("");
  const [osoite, setOsoite] = useState("");
  const [kuvaus, setKuvaus] = useState("");

  const tallenna = async () => {
    if (!otsikko.trim() || !paiva.trim() || !aika.trim() || !osoite.trim()) {
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
      // Ajastetaan 60 min ennen tapahtumaa
      await scheduleEventNotification(event, 60);

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
      <Text style={styles.title}>Uusi tapahtuma</Text>
      <Text style={styles.label}>Päivä: {paiva || "-"}</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={paiva}
        onChangeText={setPaiva}
      />
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
        placeholder="Osoite (katu, numero, kaupunki)"//lisätään myös kaupunki, jotta osoitteen sijainti on oikein
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: "#f9fafb",
  },
});
