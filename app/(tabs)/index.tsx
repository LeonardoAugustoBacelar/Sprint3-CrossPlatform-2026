/**
 * Tela Principal - Motiva App
 * Integra AppNavigator com AppProvider
 */

import { AppNavigator } from "@/src/screens/AppNavigator";
import { AppProvider } from "@/src/context/AppContext";

export default function HomeScreen() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
