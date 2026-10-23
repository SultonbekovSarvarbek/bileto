import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, formatDate, formatPrice, radius, space } from '../theme';
import { ListingStatus } from '../data';
import { useStore } from '../store';
import { Badge, Button, Chip, Empty, Field } from '../components/ui';
import { EventRow, ListingRow } from '../components/cards';
import { notify } from './ListingScreen';
import type { RootStackParamList, ScreenProps } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProfileTab() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { user, logout, listings, purchases, getSeller } = useStore();

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
        <Empty icon="person-circle-outline" title="Личный кабинет" text="Войдите, чтобы продавать билеты, следить за покупками и получать выплаты">
          <Button title="Войти по номеру телефона" onPress={() => nav.navigate('Login')} />
        </Empty>
      </View>
    );
  }

  const me = getSeller('me')!;
  const mine = listings.filter((l) => l.sellerId === 'me');
  const active = mine.filter((l) => l.status === 'active').length;
  const sold = mine.filter((l) => l.status === 'sold');
  const earned = sold.reduce((s, l) => s + l.price * Math.max(l.qty, 1), 0);

  const menu: { icon: keyof typeof Ionicons.glyphMap; title: string; badge?: string; onPress: () => void }[] = [
    { icon: 'pricetags-outline', title: 'Мои объявления', badge: String(active), onPress: () => nav.navigate('MyListings') },
    { icon: 'bag-handle-outline', title: 'Мои покупки', badge: purchases.length ? String(purchases.length) : undefined, onPress: () => nav.navigate('Purchases') },
    { icon: 'card-outline', title: 'Карта для выплат', onPress: () => notify('Карта для выплат', 'Привязка Uzcard / Humo для получения денег за проданные билеты.') },
    { icon: 'chatbubbles-outline', title: 'Сообщения', onPress: () => notify('Сообщения', 'Чаты с покупателями и продавцами.') },
    { icon: 'notifications-outline', title: 'Уведомления', onPress: () => notify('Уведомления', 'Новые билеты на избранные события, продажи, выплаты.') },
    { icon: 'shield-checkmark-outline', title: 'Верификация продавца', onPress: () => notify('Верификация', 'Подтвердите личность через MyID — получите значок «Проверен» и больше доверия покупателей.') },
    { icon: 'language-outline', title: 'Язык: Русский', onPress: () => notify('Язык', "Русский / O'zbekcha") },
    { icon: 'help-circle-outline', title: 'Помощь и правила', onPress: () => notify('Помощь', 'Правила безопасной сделки, возвраты, споры.') },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + space(2), paddingBottom: 120 }}>
      <View style={st.head}>
        <View style={st.avatar}><Text style={st.avatarText}>{user.name[0]}</Text></View>
        <View style={{ flex: 1, marginLeft: space(4) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={st.name}>{user.name}</Text>
            {me.verified && <Ionicons name="shield-checkmark" size={18} color={colors.green} />}
          </View>
          <Text style={st.phone}>{user.phone}</Text>
          <Text style={st.phone}>★ {me.rating.toFixed(1)} · {me.deals} сделки</Text>
        </View>
      </View>

      <View style={st.stats}>
        <Stat label="Активные" value={String(active)} />
        <Stat label="Продано" value={String(sold.length)} />
        <Stat label="Заработано" value={earned ? `${Math.round(earned / 1000)}K` : '0'} />
      </View>

      <View style={{ paddingHorizontal: space(4), marginBottom: space(4) }}>
        <Button title="Продать билет" icon="add-circle-outline" onPress={() => nav.navigate('Sell')} />
      </View>

      <View style={st.menu}>
        {menu.map((m, i) => (
          <Pressable key={m.title} onPress={m.onPress} style={[st.menuRow, i === menu.length - 1 && { borderBottomWidth: 0 }]}>
            <Ionicons name={m.icon} size={22} color={colors.text} />
            <Text style={st.menuText}>{m.title}</Text>
            {m.badge && m.badge !== '0' && <View style={st.menuBadge}><Text style={st.menuBadgeText}>{m.badge}</Text></View>}
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      <Pressable onPress={logout} style={st.logout}>
        <Text style={{ color: colors.red, fontWeight: '700' }}>Выйти</Text>
      </Pressable>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={st.stat}>
      <Text style={st.statValue}>{value}</Text>
      <Text style={st.statLabel}>{label}</Text>
    </View>
  );
}

const STATUS_TABS: { id: ListingStatus | 'all'; title: string }[] = [
  { id: 'active', title: 'Активные' },
  { id: 'sold', title: 'Проданные' },
  { id: 'all', title: 'Все' },
];

export function MyListingsScreen({ navigation }: ScreenProps<'MyListings'>) {
  const { listings } = useStore();
  const [tab, setTab] = useState<ListingStatus | 'all'>('active');
  const data = listings.filter((l) => l.sellerId === 'me' && (tab === 'all' || l.status === tab));
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', padding: space(4) }}>
        {STATUS_TABS.map((t) => <Chip key={t.id} label={t.title} active={tab === t.id} onPress={() => setTab(t.id)} />)}
      </View>
      <FlatList
        data={data}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View>
            <ListingRow listing={item} showEvent onPress={() => navigation.navigate('Listing', { id: item.id })} />
            <View style={st.listingMeta}>
              <Text style={st.metaText}><Ionicons name="eye-outline" size={12} /> {item.views} просмотров</Text>
              <Badge text={item.status === 'active' ? 'В продаже' : item.status === 'sold' ? 'Продано' : 'Черновик'} color={item.status === 'active' ? colors.green : colors.textDim} />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Empty icon="pricetags-outline" title="Здесь пусто" text="Не можете пойти на концерт? Продайте билет тем, кто не успел купить.">
            <Button title="Продать билет" onPress={() => navigation.navigate('Sell')} />
          </Empty>
        }
      />
    </View>
  );
}

export function PurchasesScreen({ navigation }: ScreenProps<'Purchases'>) {
  const { purchases, listings, getEvent, getVenue } = useStore();
  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: space(4) }}
      data={purchases}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => {
        const l = listings.find((x) => x.id === item.listingId);
        const e = l && getEvent(l.eventId);
        if (!l || !e) return null;
        return (
          <View style={st.ticket}>
            <View style={[st.ticketTop, { backgroundColor: e.color }]}>
              <Text style={{ fontSize: 30 }}>{e.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={st.ticketTitle} numberOfLines={2}>{e.title}</Text>
                <Text style={st.ticketMeta}>{formatDate(e.date)}</Text>
              </View>
            </View>
            <View style={st.ticketBody}>
              <Text style={st.ticketInfo}>{getVenue(e.venueId)?.name}</Text>
              <Text style={st.ticketInfo}>{l.sector}{l.row ? `, ряд ${l.row}` : ''} · {item.qty} шт.</Text>
              <View style={st.ticketFoot}>
                <Badge text="Ждём передачу от продавца" color={colors.accent} />
                <Text style={st.ticketPrice}>{formatPrice(item.total)}</Text>
              </View>
            </View>
          </View>
        );
      }}
      ListEmptyComponent={
        <Empty icon="bag-handle-outline" title="Покупок пока нет" text="Здесь появятся купленные билеты с QR-кодом для входа">
          <Button title="Смотреть афишу" variant="secondary" onPress={() => navigation.navigate('Tabs')} />
        </Empty>
      }
    />
  );
}

export function FavoritesTab() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { favorites, getEvent } = useStore();
  const data = favorites.map((id) => getEvent(id)).filter(Boolean) as NonNullable<ReturnType<typeof getEvent>>[];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + space(2) }}>
      <Text style={st.h1}>Избранное</Text>
      <Text style={st.sub}>Сообщим, когда появятся новые билеты или упадёт цена</Text>
      <FlatList
        data={data}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => <EventRow event={item} onPress={() => nav.navigate('Event', { id: item.id })} />}
        ListEmptyComponent={<Empty icon="heart-outline" title="Нет избранных событий" text="Нажмите ♡ на событии, чтобы следить за билетами" />}
      />
    </View>
  );
}

export function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  const { login } = useStore();
  const [phone, setPhone] = useState('+998 ');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: space(6) }}>
      <Text style={{ fontSize: 48, textAlign: 'center', marginTop: space(6) }}>🎟️</Text>
      <Text style={[st.h1, { textAlign: 'center', paddingHorizontal: 0, marginBottom: space(2) }]}>Вход</Text>
      <Text style={[st.sub, { textAlign: 'center', paddingHorizontal: 0, marginBottom: space(8) }]}>Покупайте и продавайте билеты безопасно</Text>
      <Field label="Номер телефона" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      {sent && <Field label="Код из SMS" keyboardType="number-pad" value={code} onChangeText={setCode} placeholder="Для демо — любые 4 цифры" maxLength={4} />}
      <Button
        title={sent ? 'Войти' : 'Получить код'}
        disabled={sent ? code.length < 4 : phone.replace(/\D/g, '').length < 12}
        onPress={() => {
          if (!sent) return setSent(true);
          login(phone);
          navigation.goBack();
        }}
      />
    </View>
  );
}

const st = StyleSheet.create({
  h1: { color: colors.text, fontSize: 28, fontWeight: '900', paddingHorizontal: space(4) },
  sub: { color: colors.textDim, fontSize: 14, paddingHorizontal: space(4), marginTop: 4, marginBottom: space(4) },
  head: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space(4), marginBottom: space(5) },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.accentText, fontSize: 30, fontWeight: '900' },
  name: { color: colors.text, fontSize: 24, fontWeight: '900' },
  phone: { color: colors.textDim, fontSize: 14, marginTop: 2 },
  stats: { flexDirection: 'row', marginHorizontal: space(4), backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: space(4) },
  stat: { flex: 1, alignItems: 'center', paddingVertical: space(4) },
  statValue: { color: colors.text, fontSize: 22, fontWeight: '900' },
  statLabel: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  menu: { marginHorizontal: space(4), backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: space(4), borderBottomWidth: 1, borderBottomColor: colors.border },
  menuText: { color: colors.text, fontSize: 16, flex: 1, marginLeft: 14 },
  menuBadge: { backgroundColor: colors.accent, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 1, marginRight: 8 },
  menuBadgeText: { color: colors.accentText, fontSize: 12, fontWeight: '800' },
  logout: { alignItems: 'center', padding: space(6) },
  listingMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: space(5), marginTop: -space(2), marginBottom: space(4) },
  metaText: { color: colors.textMuted, fontSize: 12 },
  ticket: { borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: space(4) },
  ticketTop: { flexDirection: 'row', alignItems: 'center', padding: space(4) },
  ticketTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  ticketMeta: { color: '#ffffffcc', fontSize: 13, marginTop: 2 },
  ticketBody: { padding: space(4) },
  ticketInfo: { color: colors.textDim, fontSize: 14, marginBottom: 4 },
  ticketFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space(2) },
  ticketPrice: { color: colors.text, fontSize: 16, fontWeight: '900' },
});
