import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';

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
  monthNamesShort: ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"],
  dayNames: ["Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai", "Sunnuntai"],
  dayNamesShort: ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"],
  today: "Tänään"
};

LocaleConfig.defaultLocale = "fi";

const App = () => {
  const [selected, setSelected] = useState("");

  return (
    //Tehdään kalenteri
    <Calendar
      onDayPress={day => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: "green"}
      }}
    />
  );
};

// Määritetään kalenterissa käytettävät värit
<Calendar 
  style= {{
    borderWidth: 1,
    borderColor: "teal",
    height: 350,
  }}
  theme= {{
    backgroundColor: "#ffff",
    calendarBackground: "#ffff",
    textSectionTitleColor: "#b6c1cd",
    selectedDayBackgroundColor: "#00adf5",
    selectedDayTextColor: "#ffff",
    todayTextColor: "#00adf5",
    dayTextColor: "#2d4150",
    textDisabledColor: "#dd99ee",
  }}
/>

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
