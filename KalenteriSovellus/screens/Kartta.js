import React from "react";
import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";

/* ----------------------
   Kartta komponentti
   Näyttää tapahtuman sijainnin kartalla.
   ----------------------- */
export default function Kartta({ route }) {
  // Haetaan tapahtuma navigaation avulla:
  // otsikko, lat ja lon-tiedot saadaan navigoinnin mukana route-parametrista
  const tapahtuma = route.params?.tapahtuma || {
    otsikko: "paikka1",
    lat: null,
    lon: null,
    osoite: "",
  };

  const hasCoords =
    typeof tapahtuma.lat === "number" &&
    typeof tapahtuma.lon === "number" &&
    !Number.isNaN(tapahtuma.lat) &&
    !Number.isNaN(tapahtuma.lon);

  // Jos ei ole koordinaatteja → näytetään vain informatiivinen teksti
  if (!hasCoords) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 8 }}>
          Tälle tapahtumalle ei ole tallennettu karttasijaintia.
        </Text>
        <Text
          style={{
            fontSize: 14,
            textAlign: "center",
            color: "#555",
          }}
        >
          Tarkista osoite tai luo tapahtuma uudelleen,
          kun geokoodaus on käytössä.
        </Text>
      </View>
    );
  }

  // Kun koordinaatit on olemassa, näytetään kartta ja marker
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: tapahtuma.lat,
          longitude: tapahtuma.lon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{ latitude: tapahtuma.lat, longitude: tapahtuma.lon }}
          title={tapahtuma.otsikko}
          description={tapahtuma.osoite}
        />
      </MapView>
    </View>
  );
}