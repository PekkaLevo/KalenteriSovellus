# Kalenterisovellus

Kalenterisovellus on React Native -pohjainen mobiilisovellus, joka toimii henkilökohtaisena tapahtumakalenterina. 
Käyttäjä voi lisätä, muokata ja poistaa tapahtumia, jotka tallentuvat pysyvästi SQLite-tietokantaan.
Sovelluksessa on kalenterinäkymä, tapahtumalistaukset, karttanäkymä sekä ajastetut muistutukset tulevista tapahtumista.

## Ominaisuudet

- Horisontaalisesti selattava kalenteri (react-native-calendars)
- Tapahtumien lisääminen, muokkaaminen ja poistaminen
- Tapahtumien tallennus SQLite-tietokantaan (expo-sqlite)
- Tapahtumien geokoodaus osoitteista koordinaateiksi (geocode.maps.co API)
- Karttanäkymä tapahtuman sijainnille (react-native-maps)
- Käyttäjän nykyisen sijainnin näyttäminen kartalla (expo-location)
- Ajastetut muistutukset Expo Notifications -kirjastolla
- Tulevien tapahtumien listaus aikajärjestyksessä
- Navigointi eri näkymien välillä (React Navigation)

## Käytetyt teknologiat

- React Native (Expo)
- JavaScript / React Hooks
- react-native/navigation (navigointi)
- react-native/native-stack (navigointi)
- react-native-calendars (kalenterikomponentti)
- react-native-maps (karttanäkymä markerit)
- expo-location (sijainti)
- geocode.maps.co API (Koordinaatit osoitteille)
- expo-notifications (ajastetut muistutukset)
- expo-sqlite (paikallinen tallentaminen)