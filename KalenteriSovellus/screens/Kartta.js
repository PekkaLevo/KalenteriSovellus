// Importit
import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

/* ----------------------
   Kartta komponentti
   Näyttää tapahtuman sijainnin kartalla.
   Lisäksi:
   - hakee käyttäjän nykyisen sijainnin
   - näyttää käyttäjän sijainnin erillisellä markkerilla
----------------------- */
export default function Kartta({ route }) {
  // GPS-sijainnin tila
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);

  // Haetaan tapahtuma navigaation avulla:
  // otsikko, lat ja lon-tiedot saadaan navigoinnin mukana route-parametrista
  const tapahtuma = route.params?.tapahtuma || {
    otsikko: "paikka1",
    paiva: "",
    aika: "",
    lat: null,
    lon: null,
    osoite: "",
  };

  const hasCoords =
    typeof tapahtuma.lat === "number" &&
    typeof tapahtuma.lon === "number" &&
    !Number.isNaN(tapahtuma.lat) &&
    !Number.isNaN(tapahtuma.lon);

  // Haetaan käyttäjän nykyinen sijainti kun näkymä avataan
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Sijaintilupaa ei myönnetty");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setLocation(coords);
        console.log("Nykyinen sijainti:", coords);
      } catch (e) {
        console.log("Sijainnin haku epäonnistui", e);
        setLocationError("Sijainnin haku epäonnistui");
      }
    })();
  }, []);

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
          Tarkista osoite tai luo tapahtuma uudelleen, kun geokoodaus on
          käytössä.
        </Text>
      </View>
    );
  }

  // Kun koordinaatit on olemassa, näytetään kartta ja markkerit
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {tapahtuma.otsikko}
        </Text>
        <Text style={{ color: "#555" }}>
          {tapahtuma.paiva} klo {tapahtuma.aika}
        </Text>
        {tapahtuma.osoite ? (
          <Text style={{ color: "#555", marginTop: 2 }}>
            {tapahtuma.osoite}
          </Text>
        ) : null}
        {locationError && (
          <Text style={{ color: "red", marginTop: 4, fontSize: 12 }}>
            {locationError}
          </Text>
        )}
      </View>

      {/* "Sijainti" painike näkyy jos GPS-sijainti löytyi */}
      {location && (
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
          }}
        >
          <Button
            title="Sijainti"
            onPress={() => {
              mapRef.current?.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              });
            }}
          />
        </View>
      )}

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: tapahtuma.lat,
          longitude: tapahtuma.lon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true} // yrittää näyttää systeemin sinisen pisteen
      >
        {/* Tapahtuman marker */}
        <Marker
          coordinate={{ latitude: tapahtuma.lat, longitude: tapahtuma.lon }}
          title={tapahtuma.otsikko}
          description={tapahtuma.osoite}
        />

        {/* Käyttäjän sijainti erillisellä markerilla (fallback siltä varalta,
            että showsUserLocation ei piirrä sinistä pistettä Expo Go:ssa) */}
        {location && (
          <Marker
            coordinate={location}
            title="Nykyinen sijainti"
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
}