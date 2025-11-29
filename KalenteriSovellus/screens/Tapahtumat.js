// Importit
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SectionList,
  TouchableOpacity,
} from "react-native";
import { CalendarList, LocaleConfig } from "react-native-calendars";
import {
  getEventsForDay,
  deleteEvent,
  getUpcomingEvents,
} from "../db/eventsDb";
import { useIsFocused } from "@react-navigation/native";

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
  // Päivien nimet lyhennettyinä ja annetaan tämän hetkiselle päivälle suomenkielinen nimi
  dayNamesShort: ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"],
  today: "Tänään",
};

// Asetetaan oletuskieleksi suomi
LocaleConfig.defaultLocale = "fi";

// Apufunktio: tämän päivän pvm YYYY-MM-DD
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/* -------------------
   Tapahtumat komponentti 
   Näyttää horisontaalisesti selattavan kalenterin
   ja valitun päivän tapahtumat listalla.
-------------------- */
export default function Tapahtumat({ navigation }) {
  // tarkistaa onko ruutu näkyvissä
  const isFocused = useIsFocused();
  // Valitun päivän tila – aluksi tänään
  const [selected, setSelected] = useState(getToday());
  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  // Lataa valitun päivän tapahtumat tietokannasta
  const loadEvents = async (paiva) => {
    try {
      const rows = await getEventsForDay(paiva);
      setEvents(rows);
    } catch (e) {
      console.error("Tapahtumien haku epäonnistui", e);
    }
  };

  // Lataa kaikki tulevat tapahtumat (tästä päivästä eteenpäin)
  const loadUpcoming = async () => {
    try {
      const rows = await getUpcomingEvents(); // ORDER BY paiva, aika
      const today = getToday();

      // suodatetaan vain tästä päivästä eteenpäin
      const filtered = rows.filter((ev) => ev.paiva >= today);
      setUpcoming(filtered);
    } catch (e) {
      console.error("Tulevien tapahtumien haku epäonnistui", e);
    }
  };

  // Poisto pitkällä painalluksella
  const handleLongPress = async (id) => {
    try {
      await deleteEvent(id); // poista tietokannasta
      await loadEvents(selected); // päivitä lista
      await loadUpcoming(); // päivitä tulevat tapahtumat
    } catch (e) {
      console.error("Tapahtuman poisto epäonnistui", e);
    }
  };

  // Ladataan tapahtumat, kun:
  // - valittu päivä muuttuu TAI
  // - näkymä saa fokuksen (paluu lisäys-/muokkausnäkymästä)
  useEffect(() => {
    if (isFocused && selected) {
      loadEvents(selected);
      loadUpcoming();
    }
  }, [isFocused, selected]);

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

      {/* Tapahtumat: ensin päivän, sitten tulevat, yhtenä listana */}
      <View style={styles.listContainer}>
        <SectionList
          sections={[
            { title: "Päivän tapahtumat", data: events },
            { title: "Tulevat tapahtumat", data: upcoming },
          ]}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={({ section }) =>
            section.data.length > 0 ? (
              <Text style={styles.eventsTitle}>{section.title}</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Kartta", { tapahtuma: item })}
              onLongPress={() => handleLongPress(item.id)}
              style={styles.eventItem}
            >
              <Text style={styles.eventTitle}>{item.otsikko}</Text>
              <Text style={styles.eventLine}>
                {item.paiva} klo {item.aika}
              </Text>
              <Text style={styles.eventLine}>{item.osoite}</Text>
              <Text
                style={{ marginTop: 4, color: "teal", fontSize: 13 }}
                onPress={() =>
                  navigation.navigate("MuokkaaTapahtuma", { event: item })
                }
              >
                Muokkaa
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: "#777",
                marginTop: 12,
                fontSize: 14,
              }}
            >
              Ei tapahtumia.
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </View>
  );
}

// Tyylit sovelluksen asetteluun ja kalenterin ulkoasuun
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  calendarWrap: {
    width: SCREEN_WIDTH,
    alignSelf: "center",
    marginTop: 16,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "teal",
    width: SCREEN_WIDTH,
    height: 360,
    borderRadius: 12,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  eventItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f9fafb",
    marginBottom: 8,

    // varjostetaan hieman
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1.5,
    elevation: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  eventLine: {
    fontSize: 14,
    color: "#555",
  },
  selectedBar: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  selectedValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginTop: 2,
  },
  addLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "teal",
    textDecorationLine: "underline",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
