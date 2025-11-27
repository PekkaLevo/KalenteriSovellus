// Importit
import React from "react";
import { View } from "react-native";
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
    lat: 60.1699,
    lon: 24.3984,
  };

  const hasCoords = tapahtuma.lat && tapahtuma.lon;

  return (
    <View style={{ flex: 1 }}>
      {/* MapView näyttää kartan */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: tapahtuma.lat,
          longitude: tapahtuma.lon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* Marker osoittaa koordinaattien sijainnin */}
        <Marker
          coordinate={{ latitude: tapahtuma.lat, longitude: tapahtuma.lon }}
          title={tapahtuma.otsikko}
        />
      </MapView>
    </View>
  );
}
