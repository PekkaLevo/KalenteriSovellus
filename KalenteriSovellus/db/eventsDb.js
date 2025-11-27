// Importit
import * as SQLite from "expo-sqlite";

// Avataan tietokanta ja luodaan taulu, jos sitä ei ole
let dbPromise = null;

async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("events.db");

      // Luodaan taulu, jos sitä ei ole
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          otsikko TEXT NOT NULL,
          paiva TEXT NOT NULL,
          aika TEXT NOT NULL,
          osoite TEXT NOT NULL,
          lat REAL,
          lon REAL,
          kuvaus TEXT
        );
      `);

      return db;
    })();
  }
  return dbPromise;
}

// Lisää uusi tapahtuma tietokantaan
export async function insertEvent(event) {
  const { otsikko, paiva, aika, osoite, lat, lon, kuvaus } = event;
  const db = await getDb();

  await db.runAsync(
    `
      INSERT INTO events (otsikko, paiva, aika, osoite, lat, lon, kuvaus)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [
      otsikko,
      paiva,
      aika,
      osoite,
      lat ?? null,
      lon ?? null,
      kuvaus ?? null,
    ]
  );
}

// Hae tietyn päivän tapahtumat
export async function getEventsForDay(paiva) {
  const db = await getDb();

  const rows = await db.getAllAsync(
    `
      SELECT * FROM events
      WHERE paiva = ?
      ORDER BY paiva, aika;
    `,
    [paiva]
  );

  return rows; // palauttaa taulukon tapahtuma-olioita
}

// Hae kaikki tulevat tapahtumat (tarvittaessa)
export async function getUpcomingEvents() {
  const db = await getDb();

  const rows = await db.getAllAsync(`
    SELECT * FROM events
    ORDER BY paiva, aika;
  `);

  return rows;
}

// Poista yksittäinen tapahtuma id:n perusteella
export async function deleteEvent(id) {
  const db = await getDb();

  await db.runAsync(
    `
      DELETE FROM events
      WHERE id = ?;
    `,
    [id]
  );
}