// Importit
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { updateEvent } from "../db/eventsDb";
import { geocodeAddress } from "../utils/geocode";
import { scheduleEventNotification } from "../utils/notifications";

export default function MuokkaaTapahtuma({ route, navigation }) {
  const alku = route.params?.event;

  if (!alku) {
    return (
      <View style={styles.container}>
        <Text>Ei muokattavaa tapahtumaa.</Text>
      </View>
    );
  }

  const [paiva, setPaiva] = useState(alku.paiva);
  const [otsikko, setOtsikko] = useState(alku.otsikko);
  const [aika, setAika] = useState(alku.aika);
  const [osoite, setOsoite] = useState(alku.osoite);
  const [kuvaus, setKuvaus] = useState(alku.kuvaus ?? "");

  const tallenna = async () => {
    if (!otsikko.trim() || !paiva.trim() || !aika.trim() || !osoite.trim()) {
      Alert.alert("Virhe", "Täytä kaikki kentät.");
      return;
    }

    try {
      const geo = await geocodeAddress(osoite.trim());

      const event = {
        id: alku.id,
        otsikko: otsikko.trim(),
        paiva: paiva.trim(),
        aika: aika.trim(),
        osoite: osoite.trim(),
        lat: geo?.lat ?? alku.lat ?? null,
        lon: geo?.lon ?? alku.lon ?? null,
        kuvaus: kuvaus.trim() || null,
      };

      await updateEvent(event);
       // Ajastetaan ilmoitus uudelle ajankohdalle (esim. 60 min ennen)
      await scheduleEventNotification(event, 60);
      navigation.goBack();
    } catch (e) {
      console.error("Tapahtuman päivitys epäonnistui", e);
      Alert.alert("Virhe", "Tapahtuman päivitys epäonnistui.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Muokkaa tapahtumaa</Text>
      <Text style={styles.label}>Päivä</Text>
      <TextInput
        style={styles.input}
        value={paiva}
        onChangeText={setPaiva}
        placeholder="YYYY-MM-DD"
      />

      <TextInput
        style={styles.input}
        value={otsikko}
        onChangeText={setOtsikko}
        placeholder="Otsikko"
      />

      <TextInput
        style={styles.input}
        value={aika}
        onChangeText={setAika}
        placeholder="Aika (esim. 14:30)"
      />

      <TextInput
        style={styles.input}
        value={osoite}
        onChangeText={setOsoite}
        placeholder="Osoite (katu, numero, kaupunki)" //lisätään myös kaupunki, jotta osoitteen sijainti on oikein
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        value={kuvaus}
        onChangeText={setKuvaus}
        placeholder="Kuvaus (valinnainen)"
        multiline
      />

      <Button title="Tallenna muutokset" onPress={tallenna} />
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