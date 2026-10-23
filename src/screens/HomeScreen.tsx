import React, { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, space } from '../theme';
import { CATEGORIES, CITIES } from '../data';
import { useStore } from '../store';
import { SectionTitle } from '../components/ui';
import { EventCardWide, ListingRow } from '../components/cards';
import type { RootStackParamList } from '../navigation';

export default function HomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { events, listings, city, setCity, getVenue } = useStore();
  const [cityOpen, setCityOpen] = useState(false);
  const [q, setQ] = useState('');

  const cityEvents = events.filter((e) => getVenue(e.venueId)?.city === city);
  const hot = cityEvents.filter((e) => e.soldOut);
  const fresh = listings
    .filter((l) => l.status === 'active' && l.sellerId !== 'me' && cityEvents.some((e) => e.id === l.eventId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + space(2), paddingBottom: 120 }}>
      <View style={st.header}>
        <View>
          <Text style={st.logo}>bilet<Text style={{ color: colors.accent }}>o</Text></Text>
          <Pressable onPress={() => setCityOpen(true)} style={st.cityBtn}>
            <Ionicons name="location" size={14} color={colors.accent} />
            <Text style={st.cityText}>{city}</Text>
            <Ionicons name="chevron-down" size={14} color={colors.textDim} />
          </Pressable>
        </View>
        <Pressable onPress={() => nav.navigate('Sell')} style={st.sellBtn}>
          <Ionicons name="add" size={18} color={colors.accentText} />
          <Text style={st.sellText}>Продать</Text>
        </Pressable>
      </View>

      <View style={st.search}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Артист, событие или площадка"
          placeholderTextColor={colors.textMuted}
          style={st.searchInput}
          returnKeyType="search"
          onSubmitEditing={() => q.trim() && nav.navigate('Category', { id: 'all', query: q.trim() })}
        />
      </View>

      <View style={st.promo}>
        <View style={{ flex: 1 }}>
          <Text style={st.promoTitle}>Не успели купить?</Text>
          <Text style={st.promoText}>Билеты на sold-out события от людей, которые не смогут пойти. Деньги продавцу — только после передачи билета.</Text>
        </View>
        <Text style={{ fontSize: 46 }}>🎟️</Text>
      </View>

      <SectionTitle title="Категории" action="Все" onAction={() => nav.navigate('Category', { id: 'all' })} />
      <View style={st.catGrid}>
        {CATEGORIES.map((c) => (
          <Pressable key={c.id} onPress={() => nav.navigate('Category', { id: c.id })} style={st.catItem}>
            <View style={[st.catIcon, { backgroundColor: c.color + '22' }]}>
              <Ionicons name={c.icon as any} size={22} color={c.color} />
            </View>
            <Text style={st.catText} numberOfLines={1}>{c.title}</Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle title="🔥 Раскуплено в кассе" />
      {hot.length ? (
        <FlatList
          horizontal
          data={hot}
          keyExtractor={(e) => e.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space(4) }}
          renderItem={({ item }) => <EventCardWide event={item} onPress={() => nav.navigate('Event', { id: item.id })} />}
        />
      ) : (
        <Text style={st.none}>В городе {city} пока нет sold-out событий</Text>
      )}

      <SectionTitle title="Скоро" />
      <FlatList
        horizontal
        data={cityEvents.filter((e) => !e.soldOut)}
        keyExtractor={(e) => e.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: space(4) }}
        renderItem={({ item }) => <EventCardWide event={item} onPress={() => nav.navigate('Event', { id: item.id })} />}
        ListEmptyComponent={<Text style={[st.none, { paddingHorizontal: 0 }]}>Нет событий</Text>}
      />

      <SectionTitle title="Новые объявления" />
      {fresh.map((l) => (
        <ListingRow key={l.id} listing={l} showEvent onPress={() => nav.navigate('Listing', { id: l.id })} />
      ))}
      {!fresh.length && <Text style={st.none}>Пока пусто — станьте первым продавцом</Text>}

      <Modal visible={cityOpen} transparent animationType="fade" onRequestClose={() => setCityOpen(false)}>
        <Pressable style={st.backdrop} onPress={() => setCityOpen(false)}>
          <View style={st.sheet}>
            <Text style={st.sheetTitle}>Город</Text>
            {CITIES.map((c) => (
              <Pressable key={c} style={st.sheetRow} onPress={() => { setCity(c); setCityOpen(false); }}>
                <Text style={[st.sheetRowText, c === city && { color: colors.accent }]}>{c}</Text>
                {c === city && <Ionicons name="checkmark" size={20} color={colors.accent} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space(4) },
  logo: { color: colors.text, fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  cityBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 4 },
  cityText: { color: colors.textDim, fontSize: 14, fontWeight: '600' },
  sellBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.accent, paddingHorizontal: 14, height: 40, borderRadius: 20 },
  sellText: { color: colors.accentText, fontWeight: '800', marginLeft: 4 },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, marginHorizontal: space(4), marginTop: space(4), paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, marginLeft: 8, height: '100%' },
  promo: { flexDirection: 'row', alignItems: 'center', marginHorizontal: space(4), marginTop: space(4), padding: space(4), borderRadius: radius.lg, backgroundColor: '#2A2410', borderWidth: 1, borderColor: '#4A3D12' },
  promoTitle: { color: colors.accent, fontSize: 17, fontWeight: '800' },
  promoText: { color: colors.textDim, fontSize: 13, marginTop: 4, lineHeight: 18, marginRight: 8 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: space(2) },
  catItem: { width: '25%', alignItems: 'center', marginBottom: space(4) },
  catIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  catText: { color: colors.text, fontSize: 12, fontWeight: '600', marginTop: 6 },
  none: { color: colors.textMuted, paddingHorizontal: space(4), fontSize: 14 },
  backdrop: { flex: 1, backgroundColor: '#000a', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space(5), paddingBottom: space(10) },
  sheetTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: space(3) },
  sheetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetRowText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
