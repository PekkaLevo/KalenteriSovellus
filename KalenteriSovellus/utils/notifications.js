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