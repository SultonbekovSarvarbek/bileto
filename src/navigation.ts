import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CategoryId } from './data';

export type RootStackParamList = {
  Tabs: undefined;
  Event: { id: string };
  Listing: { id: string };
  Checkout: { id: string; qty: number };
  Category: { id: CategoryId | 'all'; query?: string };
  Sell: { eventId?: string; editId?: string } | undefined;
  MyListings: undefined;
  Purchases: undefined;
  Login: undefined;
  Done: { kind: 'bought' | 'listed'; id: string };
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
