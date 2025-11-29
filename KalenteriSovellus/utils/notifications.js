import * as Notifications from "expo-notifications";

// Kun ilmoitus tulee appin ollessa auki, näytetään alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Pyydetään lupaa ilmoituksille
export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();

  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === "granted";
  }
  return true;
}
// Ajastetaan ilmoitus tietylle tapahtumalle
export async function scheduleEventNotification(event, offsetMinutes = 30) {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.log("Ei lupaa ilmoituksille.");
    return;
  }

  const { otsikko, paiva, aika } = event;

  // sallitaan 12.30 tai 12:30
  const normalized = aika.replace(".", ":");
  const [hh, mm] = normalized.split(":").map(Number);

  const [year, month, day] = paiva.split("-").map(Number);

  const eventDate = new Date(year, month - 1, day, hh, mm);
  const triggerTime = new Date(eventDate.getTime() - offsetMinutes * 60000);

  if (triggerTime <= new Date()) {
    console.log("Ilmoitusta ei ajastettu (menneisyys tai liian lähellä).");
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Tuleva tapahtuma",
      body: `${otsikko} klo ${aika}`,
    },
    trigger: triggerTime,
  });

  console.log("Ilmoitus ajastettu:", triggerTime.toISOString());
}
