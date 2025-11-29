// Importit
import React, { useEffect, useState, useRef } from "react";
import { View, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

/* ----------------------
   Kartta-komponentti
   - näyttää valitun tapahtuman sijainnin kartalla
   - hakee käyttäjän nykyisen sijainnin (GPS)
   - näyttää käyttäjän sijainnin sinisenä pisteenä (showsUserLocation)
----------------------- */
export default function Kartta({ route }) {
  // GPS-sijainnin tila
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Kartan referenssi (mahdollistaa animateToRegion myöhemmin)
  const mapRef = useRef(null);

  // Tapahtuma, joka tuotiin navigaation parametrina
  const tapahtuma = route.params?.tapahtuma || {
    otsikko: "Tapahtuma",
    paiva: "",
    aika: "",
    osoite: "",
    lat: null,
    lon: null,
  };

  // Tarkista onko tapahtumalla koordinaatit
  const hasCoords =
    typeof tapahtuma.lat === "number" &&
    typeof tapahtuma.lon === "number" &&
    !Number.isNaN(tapahtuma.lat) &&
    !Number.isNaN(tapahtuma.lon);

  /* ----------------------
     Haetaan käyttäjän nykyinen sijainti
     expo-locationilla heti kun näkymä avataan.
  ------------------------- */
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Sijaintilupaa ei myönnetty");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (e) {
        console.log("Sijainnin haku epäonnistui", e);
      }
    })();
  }, []);

  /* ----------------------
     Jos tapahtumalla ei ole karttakoordinaatteja
     → näytetään info-teksti eikä karttaa
  ------------------------- */
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
        <Text style={{ fontSize: 14, textAlign: "center", color: "#555" }}>
          Tarkista osoite tai luo tapahtuma uudelleen.
        </Text>
      </View>
    );
  }

  /* ----------------------
     Varsinainen karttanäkymä:
     - näyttää tapahtuman markerin
     - näyttää käyttäjän sijainnin (sininen piste)
  ------------------------- */
  return (
    <View style={{ flex: 1 }}>
      {/* Tapahtuman otsikko + tiedot */}
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
      </View>

      {/* Keskitä kartta -painike näkyy vain jos GPS löytyy */}
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

      {/* Kartta */}
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: tapahtuma.lat,
          longitude: tapahtuma.lon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}     // ← näyttää sinisen pisteen
        followsUserLocation={false}  // ← ei pakolla seuraa
      >
        {/* Tapahtuman marker */}
        <Marker
          coordinate={{ latitude: tapahtuma.lat, longitude: tapahtuma.lon }}
          title={tapahtuma.otsikko}
          description={tapahtuma.osoite}
        />
      </MapView>
    </View>
  );
}