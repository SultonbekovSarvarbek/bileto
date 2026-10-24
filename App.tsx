import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StoreProvider, useStore } from './src/store';
import { colors } from './src/theme';
import type { RootStackParamList } from './src/navigation';
import HomeScreen from './src/screens/HomeScreen';
import EventScreen from './src/screens/EventScreen';
import ListingScreen from './src/screens/ListingScreen';
import DoneScreen from './src/screens/DoneScreen';
import SellScreen from './src/screens/SellScreen';
import { FavoritesTab, LoginScreen, MyListingsScreen, ProfileTab, PurchasesScreen } from './src/screens/ProfileScreens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg, text: colors.text, border: colors.border, primary: colors.accent },
};

function Tabs() {
  const { t } = useStore();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 84, paddingTop: 8 },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
            Home: ['home', 'home-outline'],
            Favorites: ['heart', 'heart-outline'],
            Profile: ['person', 'person-outline'],
          };
          const pair = icons[route.name];
          return pair ? <Ionicons name={focused ? pair[0] : pair[1]} size={24} color={color} /> : null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t.tabs.home }} />
      <Tab.Screen name="Favorites" component={FavoritesTab} options={{ title: t.tabs.favorites }} />
      <Tab.Screen name="Profile" component={ProfileTab} options={{ title: t.tabs.profile }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Root />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const { t } = useStore();
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800' },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Event" component={EventScreen} options={{ title: '' }} />
        <Stack.Screen name="Listing" component={ListingScreen} options={{ title: t.headers.listing }} />
        <Stack.Screen
          name="Sell"
          component={SellScreen}
          options={({ route }) => ({ title: route.params?.editId ? t.headers.edit : t.common.sellTicket, presentation: 'modal' })}
        />
        <Stack.Screen name="MyListings" component={MyListingsScreen} options={{ title: t.headers.myListings }} />
        <Stack.Screen name="Purchases" component={PurchasesScreen} options={{ title: t.headers.purchases }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: '', presentation: 'modal' }} />
        <Stack.Screen name="Done" component={DoneScreen} options={{ headerShown: false, gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
