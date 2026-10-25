import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, radius, space } from '../theme';
import { CITIES } from '../data';
import { useStore } from '../store';
import { Button, SectionTitle } from '../components/ui';
import { ListingRow } from '../components/cards';
import type { RootStackParamList } from '../navigation';

export default function HomeScreen() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { listings, city, setCity, isMine, feed, refreshFeed, listingView, t } = useStore();
  const cityName = t.cities[city] ?? city;
  const [cityOpen, setCityOpen] = useState(false);
  const [q, setQ] = useState('');

  const query = q.trim().toLowerCase();
  const fresh = listings
    .filter((l) => l.status === 'active' && !isMine(l) && l.city === city)
    .filter((l) => {
      if (!query) return true;
      const v = listingView(l);
      return [v.title, l.description, v.venue].some((s) => s?.toLowerCase().includes(query));
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + space(2), paddingBottom: 120 }}
      refreshControl={<RefreshControl refreshing={feed.loading && listings.length > 0} onRefresh={refreshFeed} tintColor={colors.accent} />}
    >
      <View style={st.header}>
        <View>
          <View style={st.brand}>
            <Image source={require('../../assets/logo-mark.png')} style={st.mark} />
            <Text style={st.logo}>bilet<Text style={{ color: colors.accent }}>o</Text></Text>
          </View>
          <Pressable onPress={() => setCityOpen(true)} style={st.cityBtn}>
            <Ionicons name="location" size={14} color={colors.accent} />
            <Text style={st.cityText}>{cityName}</Text>
            <Ionicons name="chevron-down" size={14} color={colors.textDim} />
          </Pressable>
        </View>
        <Pressable onPress={() => nav.navigate('Sell')} style={st.sellBtn}>
          <Ionicons name="add" size={18} color={colors.accentText} />
          <Text style={st.sellText}>{t.common.sellTicket}</Text>
        </Pressable>
      </View>

      <View style={st.search}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder={t.home.search}
          placeholderTextColor={colors.textMuted}
          style={st.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <View style={st.promo}>
        <View style={{ flex: 1 }}>
          <Text style={st.promoTitle}>{t.home.promoTitle}</Text>
          <Text style={st.promoText}>{t.home.promoText}</Text>
        </View>
        <Text style={{ fontSize: 46 }}>🎟️</Text>
      </View>

      <SectionTitle title={t.home.fresh} />
      {fresh.map((l) => (
        <ListingRow key={l.id} listing={l} showEvent onPress={() => nav.navigate('Listing', { id: l.id })} />
      ))}
      {!fresh.length &&
        (feed.loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: space(6) }} />
        ) : feed.error ? (
          <View style={{ paddingHorizontal: space(4), alignItems: 'flex-start' }}>
            <Text style={[st.none, { paddingHorizontal: 0 }]}>{t.home.feedError}. {t.common.networkError}</Text>
            <Button title={t.common.retry} variant="secondary" icon="refresh" onPress={refreshFeed} style={{ marginTop: space(3) }} />
          </View>
        ) : (
          <Text style={st.none}>{query ? t.home.nothing : t.home.freshEmpty}</Text>
        ))}

      <Modal visible={cityOpen} transparent animationType="fade" onRequestClose={() => setCityOpen(false)}>
        <Pressable style={st.backdrop} onPress={() => setCityOpen(false)}>
          <View style={st.sheet}>
            <Text style={st.sheetTitle}>{t.home.city}</Text>
            {CITIES.map((c) => (
              <Pressable key={c} style={st.sheetRow} onPress={() => { setCity(c); setCityOpen(false); }}>
                <Text style={[st.sheetRowText, c === city && { color: colors.accent }]}>{t.cities[c] ?? c}</Text>
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
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: { width: 36, height: 25, resizeMode: 'contain' },
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
  none: { color: colors.textMuted, paddingHorizontal: space(4), fontSize: 14 },
  backdrop: { flex: 1, backgroundColor: '#000a', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space(5), paddingBottom: space(10) },
  sheetTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: space(3) },
  sheetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetRowText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
