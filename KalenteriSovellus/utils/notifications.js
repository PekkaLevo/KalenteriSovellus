import * as Notifications from "expo-notifications";

// Kun ilmoitus tulee appin ollessa auki, näytetään alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});