// Importit
import { GEOCODE_API_KEY } from "../config/geocodeConfig";
// Hakee osoitteelle koordinaatit (lat, lon) geocode.maps.co API:sta
export async function geocodeAddress(osoite) {
  if (!osoite || !osoite.trim()) return null;

  const url = `https://geocode.maps.co/search?q=${encodeURIComponent(osoite)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.warn("Geokoodaus epäonnistui:", res.status);
      return null;
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      // Ei löytynyt nimettyä osoitetta → palautetaan null
      return null;
    }

    const paikka = data[0];
    const lat = Number(paikka.lat);
    const lon = Number(paikka.lon);

    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

    return {
      lat,
      lon,
    };
  } catch (err) {
    console.warn("Geokoodausvirhe:", err);
    return null;
  }
}