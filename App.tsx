import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StoreProvider } from './src/store';
import { colors } from './src/theme';
import type { RootStackParamList } from './src/navigation';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen, { CatalogTab } from './src/screens/CatalogScreen';
import EventScreen from './src/screens/EventScreen';
import ListingScreen from './src/screens/ListingScreen';
import CheckoutScreen, { DoneScreen } from './src/screens/CheckoutScreen';
import SellScreen from './src/screens/SellScreen';
import { FavoritesTab, LoginScreen, MyListingsScreen, ProfileTab, PurchasesScreen } from './src/screens/ProfileScreens';
import { CATEGORIES } from './src/data';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: colors.bg, card: colors.bg, text: colors.text, border: colors.border, primary: colors.accent },
};

function Empty() {
  return null;
}

function Tabs() {
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
            Catalog: ['grid', 'grid-outline'],
            Favorites: ['heart', 'heart-outline'],
            Profile: ['person', 'person-outline'],
          };
          const pair = icons[route.name];
          return pair ? <Ionicons name={focused ? pair[0] : pair[1]} size={24} color={color} /> : null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
      <Tab.Screen name="Catalog" component={CatalogTab} options={{ title: 'Афиша' }} />
      <Tab.Screen
        name="SellTab"
        component={Empty}
        options={({ navigation }) => ({
          title: '',
          tabBarButton: () => (
            <Pressable style={st.fabWrap} onPress={() => navigation.navigate('Sell')}>
              <View style={st.fab}><Ionicons name="add" size={30} color={colors.accentText} /></View>
            </Pressable>
          ),
        })}
      />
      <Tab.Screen name="Favorites" component={FavoritesTab} options={{ title: 'Избранное' }} />
      <Tab.Screen name="Profile" component={ProfileTab} options={{ title: 'Кабинет' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
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
            <Stack.Screen name="Listing" component={ListingScreen} options={{ title: 'Объявление' }} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Оформление' }} />
            <Stack.Screen
              name="Category"
              component={CategoryScreen}
              options={({ route }) => ({ title: route.params.id === 'all' ? 'Все события' : CATEGORIES.find((c) => c.id === route.params.id)?.title })}
            />
            <Stack.Screen
              name="Sell"
              component={SellScreen}
              options={({ route }) => ({ title: route.params?.editId ? 'Редактировать' : 'Продать билет', presentation: 'modal' })}
            />
            <Stack.Screen name="MyListings" component={MyListingsScreen} options={{ title: 'Мои объявления' }} />
            <Stack.Screen name="Purchases" component={PurchasesScreen} options={{ title: 'Мои покупки' }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: '', presentation: 'modal' }} />
            <Stack.Screen name="Done" component={DoneScreen} options={{ headerShown: false, gestureEnabled: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const st = StyleSheet.create({
  fabWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-start' },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: -18, shadowColor: colors.accent, shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
});
