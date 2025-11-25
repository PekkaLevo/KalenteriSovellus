// importoidaan kirjastot
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Tapahtumat from "./screens/Tapahtumat";
import Kartta from "./screens/Kartta";
import UusiTapahtuma from "./screens/UusiTapahtuma";

const Pino = createNativeStackNavigator();

/* --------------
  Pääkomponentti
  ---------------
  Navigointi + Tapahtumat- ja Kartta-ruudut
*/
export default function App() {
  return (
    <NavigationContainer>
      <Pino.Navigator>
        <Pino.Screen
          name="Tapahtumat"
          component={Tapahtumat}
          options={{ headerTitle: "Tapahtumat" }}
        />
        <Pino.Screen
          name="UusiTapahtuma"
          component={UusiTapahtuma}
          options={{ headerTitle: "Uusi tapahtuma" }}
        />
        <Pino.Screen
          name="Kartta"
          component={Kartta}
          options={{ headerTitle: "Kartta" }}
        />
      </Pino.Navigator>
    </NavigationContainer>
  );
}
