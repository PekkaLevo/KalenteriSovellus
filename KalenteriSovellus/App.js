// importoidaan kirjastot
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapView, { Marker } from "react-native-maps";

const Pino = createNativeStackNavigator();

function Tapahtumat({ navigation }) {
  // valitun päivän tila
  const [selected, setSelected] = useState("");

  /* -------------------
    Tapahtuma komponentti 
    Näyttää horisontaalisesti selattavan kalenterin
    --------------------
  */
  return (
    <View style={styles.container}>
      <View style={styles.calendarWrap}>
        {/* Kalenteri */}
        <CalendarList
          horizontal
          pagingEnabled
          scrollEnabled
          calendarWidth={SCREEN_WIDTH}
          style={styles.calendar}
          theme={calendarTheme}
          pastScrollRange={50} // Max määrä kuukausia, joita voi selata taaksepäin
          futureScrollRange={50} // Max määrä kuukausia, joita voi selata eteenpäin
          onDayPress={(day) => setSelected(day.dateString)} // Päivän valinta
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: "green",
            },
          }}
          showScrollIndicator={false}
        />
      </View>
      {/* Valittu päivä ja linkki karttaan*/}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text>Valittu päivä: {selected || "-"}</Text>
        <Text
          onPress={() =>
            navigation.navigate("Kartta", {
              tapahtuma: {
                otsikko: "Tapahtuma1",
                lat: 60.1699,
                lon: 24.9384,
              },
            })
          }
          style={{
            marginTop: 10,
            color: "green",
            fontWeight: "bold",
            textDecorationLine: "underline",
          }}
        >
          Näytä kartalta
        </Text>
      </View>
    </View>
  );
}

/* ----------------------
  Kartta komponentti
  Näyttää tapahtumien sijainnin kartalta
  -----------------------
*/

function Kartta({ route }) {
  const tapahtuma = route.params?.tapahtuma || {
    // Haetaan tapahtuma navigaation avulla 
    // otsikko, lat ja lon-tiedot saadaan navigoinnin mukana route-parametrista
    otsikko: "paikka1",
    lat: 60.1699,
    lon: 24.3984,
  };
  return (
    <View style={{ flex: 1 }}>
      {/* MapView näyttää kartan*/}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: tapahtuma.lat,
          longitude: tapahtuma.lon,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* Marker osoittaa kordinaattien sijainnin*/}
        <Marker
          coordinate={{ latitude: tapahtuma.lat, longitude: tapahtuma.lon }}
          title={tapahtuma.otsikko}
        />
      </MapView>
    </View>
  );
}

// Haetaan laitteen näytön leveys kalenterin leveyden asettamista varten
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Kalenterin väriteema ja ulkoasu
const calendarTheme = {
  backgroundColor: "#ffff",
  calendarBackground: "#ffff",
  textSectionTitleColor: "#b6c1cd",
  selectedDayBackgroundColor: "#00adf5",
  selectedDayTextColor: "#ffff",
  todayTextColor: "#00adf5",
  dayTextColor: "#2d4150",
  textDisabledColor: "#dd99ee",
};

// Kuukausien nimet kalenterikomponenttiin
LocaleConfig.locales["fi"] = {
  monthNames: [
    "Tammikuu",
    "Helmikuu",
    "Maaliskuu",
    "Huhtikuu",
    "Toukokuu",
    "Kesäkuu",
    "Heinäkuu",
    "Elokuu",
    "Syyskuu",
    "Lokakuu",
    "Marraskuu",
    "Joulukuu",
  ],
  // Kuukausien nimet lyhennettyinä kalenterikomponenttiin
  monthNamesShort: [
    "Tammi",
    "Helmi",
    "Maalis",
    "Huhti",
    "Touko",
    "Kesä",
    "Heinä",
    "Elo",
    "Syys",
    "Loka",
    "Marras",
    "Joulu",
  ],
  // Päivien nimet kalenterikomponenttiin
  dayNames: [
    "Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai",
    "Sunnuntai",
  ],
  //Päivien nimet lyhennettyinä ja annetaan tämän hetkiselle päivälle suomenkielinen nimi
  dayNamesShort: ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"],
  today: "Tänään",
};

// Asetetaan oletuskieleksi suomi
LocaleConfig.defaultLocale = "fi";

// Tyylit sovelluksen asetteluun ja kalenterin ulkoasuun
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  calendarWrap: {
    width: SCREEN_WIDTH,
    alignSelf: "center",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "teal",
    width: SCREEN_WIDTH,
    height: 360,
    borderRadius: 12,
  },
});
