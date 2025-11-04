import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, FlatList, Keyboard, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider, Text, Input, Button, ListItem, Divider } from '@rneui/themed';
import { Feather } from '@expo/vector-icons';
import { Feather } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as SQLite from "expo-sqlite";

const Stack = createNativeStackNavigator();

async function openDb() {
  const db = await SQLite.openDatabaseAsync("places.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT,
      address TEXT,
      lat REAL,
      lon REAL
    );
  `);
  return db;
}

const GEOCODE_URL = "https://geocode.maps.co/search?q=";

function PlacesScreen({ navigation }) {
  const [db, setDb] = useState(null);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const _db = await openDb();
        setDb(_db);
        const rows = await _db.getAllAsync("SELECT * FROM places ORDER BY id DESC;");
        setItems(rows);
      } catch (e) {
        console.error(e);
        Alert.alert("DB error", "Failed to open database.");
      }
    })();
  }, []);

  const refresh = useCallback(async () => {
    if (!db) return;
    const rows = await db.getAllAsync("SELECT * FROM places ORDER BY id DESC;");
    setItems(rows);
  }, [db]);

  const addPlace = async () => {
    const t = title.trim();
    const a = address.trim();
    if (!t || !a) {
      Alert.alert("Missing info", "Please enter both Title and Address.");
      return;
    }
    setSaving(true);
    Keyboard.dismiss();
    try {
      const res = await fetch(GEOCODE_URL + encodeURIComponent(a));
      if (!res.ok) throw new Error(`Geocode HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || !data.length) {
        Alert.alert("Not found", "No results for that address.");
        setSaving(false);
        return;
      }
      const first = data[0];
      const lat = parseFloat(first.lat);
      const lon = parseFloat(first.lon);
      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        Alert.alert("Error", "Invalid coordinates from geocoder.");
        setSaving(false);
        return;
      }
      await db.runAsync(
        "INSERT INTO places (title, address,lat,lon) VALUES (?,?,?,?);",
        [t, a, lat, lon]
      );
      setTitle("");
      setAddress("");
      await refresh();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Saving failed.");
    } finally {
      setSaving(false);
    }
  };

  const deletePlace = async (id) => {
    if (!db) return;
    await db.runAsync("DELETE FROM places WHERE id = ?;", [id]);
    await refresh();
  };

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onPress={() => navigation.navigate("Map", { place: item })}
      onLongPress={() => deletePlace(item.id)}
      containerStyle={styles.listItem}
    >
      <Feather name="map-pin" size={20} />
      <ListItem.Content>
        <ListItem.Title style={styles.itemTitle}>{item.title}</ListItem.Title>
        <ListItem.Subtitle style={styles.itemSubtitle}>{item.address}</ListItem.Subtitle>
      </ListItem.Content>
      <Feather name="chevron-right" size={20} />
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <Text h3 style={styles.title}>Places</Text>

      <View style={styles.inputsRow}>
        <Input
          placeholder="Title (e.g. Home, Best pizza)"
          value={title}
          onChangeText={setTitle}
          leftIcon={<Feather name="edit-3" size={18} />}
          containerStyle={styles.inputHalf}
          inputContainerStyle={styles.inputInner}
          returnKeyType="next"
        />
        <Input
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          leftIcon={<Feather name="map-pin" size={18} />}
          containerStyle={styles.inputHalf}
          inputContainerStyle={styles.inputInner}
          returnKeyType="done"
          onSubmitEditing={addPlace}
        />
      </View>

      <View style={styles.buttonsRow}>
        <Button
          title="Add"
          onPress={addPlace}
          loading={saving}
          icon={<Feather key="add" name="plus" size={16} color="#fff" />}
          buttonStyle={styles.primaryBtn}
        />
        <Button
          title="Clear All"
          type="outline"
          onPress={async () => { if (db){ await db.execAsync("DELETE FROM places;"); await refresh(); }}}
          icon={<Feather key="trash" name="trash-2" size={16} color="#d33" />}
          titleStyle={{ color: "#d33" }}
          buttonStyle={styles.clearBtn}
        />
      </View>

      <Divider style={{ width: "90%", marginVertical: 10 }} />

      <FlatList
        style={styles.list}
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No places yet. Add one!</Text>}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function MapScreen({ route }) {
  const place = route.params?.place;
  const region = {
    latitude: place?.lat ?? 60.1699,
    longitude: place?.lon ?? 24.9384,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={region}>
        {place && (
          <Marker
            coordinate={{ latitude: place.lat, longitude: place.lon }}
            title={place.title}
            description={place.address}
          />
        )}
      </MapView>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={{ lightColors: { primary: "#4f46e5" }, mode: "light" }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Places"
            component={PlacesScreen}
            options={{ headerTitle: "Places" }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ headerTitle: "Map" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40, alignItems: "center" },
  title: { marginBottom: 8 },
  inputsRow: { width: "92%", flexDirection: "row", gap: 10 },
  inputHalf: { flex: 1 },
  inputInner: {
    borderBottomWidth: 0,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonsRow: {
    width: "92%", flexDirection: "row", justifyContent: "center",
    marginBottom: 8, columnGap: 12,
  },
  primaryBtn: { paddingHorizontal: 18, borderRadius: 10 },
  clearBtn: { paddingHorizontal: 18, borderRadius: 10, borderColor: "#d33" },
  list: { width: "92%", marginTop: 6 },
  listItem: { borderRadius: 12, marginVertical: 6, paddingVertical: 10 },
  itemTitle: { fontSize: 16, fontWeight: "600" },
  itemSubtitle: { color: "#6b7280", marginTop: 2 },
  empty: { color: "#777", marginTop: 16, textAlign: "center" },
});