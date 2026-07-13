import { Stack } from 'expo-router'
import { AppProvider } from '../src/context/AppContext'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppProvider>
  )
}
