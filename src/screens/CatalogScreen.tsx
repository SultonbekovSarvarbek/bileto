import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, space } from '../theme';
import { CATEGORIES, CategoryId } from '../data';
import { useStore } from '../store';
import { Chip, Empty } from '../components/ui';
import { EventRow } from '../components/cards';
import type { RootStackParamList, ScreenProps } from '../navigation';

type Sort = 'date' | 'price' | 'offers';

export function Catalog({ initialCat = 'all', initialQuery = '', topInset = 0 }: { initialCat?: CategoryId | 'all'; initialQuery?: string; topInset?: number }) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { events, city, getVenue, activeListingsFor } = useStore();
  const [cat, setCat] = useState<CategoryId | 'all'>(initialCat);
  const [q, setQ] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>('date');
  const [onlyOffers, setOnlyOffers] = useState(false);

  const data = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = events.filter((e) => {
      const venue = getVenue(e.venueId);
      if (venue?.city !== city) return false;
      if (cat !== 'all' && e.category !== cat) return false;
      if (query && !(e.title.toLowerCase().includes(query) || venue?.name.toLowerCase().includes(query))) return false;
      if (onlyOffers && activeListingsFor(e.id).length === 0) return false;
      return true;
    });
    const minPrice = (id: string) => activeListingsFor(id)[0]?.price ?? Infinity;
    list = [...list].sort((a, b) =>
      sort === 'date' ? a.date.localeCompare(b.date)
        : sort === 'price' ? minPrice(a.id) - minPrice(b.id)
          : activeListingsFor(b.id).length - activeListingsFor(a.id).length,
    );
    return list;
  }, [events, city, cat, q, sort, onlyOffers, activeListingsFor, getVenue]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: topInset }}>
      <View style={st.search}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput value={q} onChangeText={setQ} placeholder={`Поиск в городе ${city}`} placeholderTextColor={colors.textMuted} style={st.searchInput} />
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chips}>
          <Chip label="Все" active={cat === 'all'} onPress={() => setCat('all')} />
          {CATEGORIES.map((c) => (
            <Chip key={c.id} label={c.title} icon={c.icon as any} color={c.color} active={cat === c.id} onPress={() => setCat(c.id)} />
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[st.chips, { paddingTop: 0 }]}>
          <Chip label="По дате" icon="calendar-outline" active={sort === 'date'} onPress={() => setSort('date')} />
          <Chip label="Дешевле" icon="pricetag-outline" active={sort === 'price'} onPress={() => setSort('price')} />
          <Chip label="Больше предложений" icon="flame-outline" active={sort === 'offers'} onPress={() => setSort('offers')} />
          <Chip label="Только с билетами" icon="ticket-outline" active={onlyOffers} onPress={() => setOnlyOffers((v) => !v)} />
        </ScrollView>
      </View>
      <FlatList
        data={data}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => <EventRow event={item} onPress={() => nav.navigate('Event', { id: item.id })} />}
        ListEmptyComponent={<Empty icon="search" title="Ничего не нашлось" text="Попробуйте другую категорию, город или запрос" />}
      />
    </View>
  );
}

export function CatalogTab() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Text style={[st.h1, { paddingTop: insets.top + space(2) }]}>Афиша</Text>
      <Catalog />
    </View>
  );
}

export default function CategoryScreen({ route }: ScreenProps<'Category'>) {
  return <Catalog initialCat={route.params.id} initialQuery={route.params.query} topInset={space(2)} />;
}

const st = StyleSheet.create({
  h1: { color: colors.text, fontSize: 28, fontWeight: '900', paddingHorizontal: space(4), backgroundColor: colors.bg },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, marginHorizontal: space(4), marginTop: space(3), paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, marginLeft: 8, height: '100%' },
  chips: { paddingHorizontal: space(4), paddingVertical: space(3) },
});
