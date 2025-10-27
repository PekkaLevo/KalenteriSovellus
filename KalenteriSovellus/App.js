import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  dayNames: [
    "Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai",
    "Sunnuntai",
  ],
  dayNamesShort: ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"],
  today: "Tänään",
};

LocaleConfig.defaultLocale = "fi";

export default function App() {
  const [selected, setSelected] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.calendarWrap}>
        <CalendarList
          horizontal
          pagingEnabled
          scrollEnabled
          calendarWidth={SCREEN_WIDTH}
          style={styles.calendar}
          theme={calendarTheme}
          pastScrollRange={50}
          futureScrollRange={50}
          onDayPress={(day) => setSelected(day.dateString)}
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
