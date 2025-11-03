// Komponentit
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";

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

export default function App() {
  // Valitun päivän tila, jota päivitetään käyttäjän painalluksesta
  const [selected, setSelected] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrap}>
        {/* Horisontaalisesti vieritettävä kalenteri, jossa näytetään useita kuukausia */}
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
    </View>
  );
}

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
