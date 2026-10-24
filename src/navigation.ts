import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Tabs: undefined;
  Event: { id: string };
  Listing: { id: string };
  Sell: { eventId?: string; editId?: string } | undefined;
  MyListings: undefined;
  Purchases: undefined;
  Login: undefined;
  Done: { id: string };
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
