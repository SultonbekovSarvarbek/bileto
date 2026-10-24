import React, { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, formatDate, formatPhone, formatPrice, radius, space } from '../theme';
import { ListingStatus } from '../data';
import { Role, useStore } from '../store';
import { LANGS } from '../i18n';
import { Badge, Button, Chip, Empty } from '../components/ui';
import { Cover, EventRow, ListingRow } from '../components/cards';
import { confirm, notify } from './ListingScreen';
import { RegisterForm } from '../components/RegisterForm';
import type { RootStackParamList, ScreenProps } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ProfileTab() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { user, logout, setRole, listings, requests, getSeller, t } = useStore();
  const [langOpen, setLangOpen] = useState(false);

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top }}>
        <Empty icon="person-circle-outline" title={t.profile.cabinet} text={t.profile.loginPrompt}>
          <Button title={t.common.loginByPhone} onPress={() => nav.navigate('Login')} />
          <Button title={`${t.profile.language}: ${t.langName}`} variant="ghost" icon="language-outline" onPress={() => setLangOpen(true)} style={{ marginTop: space(3) }} />
        </Empty>
        <LanguageSheet visible={langOpen} onClose={() => setLangOpen(false)} />
      </View>
    );
  }

  const roleName = (r: Role) => (r === 'seller' ? t.register.seller : t.register.buyer);
  const me = getSeller('me')!;
  const mine = listings.filter((l) => l.sellerId === 'me');
  const active = mine.filter((l) => l.status === 'active').length;
  const sold = mine.filter((l) => l.status === 'sold');
  const earned = sold.reduce((s, l) => s + l.price * Math.max(l.qty, 1), 0);

  const menu: { icon: keyof typeof Ionicons.glyphMap; title: string; badge?: string; onPress: () => void }[] = [
    { icon: 'pricetags-outline', title: t.headers.myListings, badge: String(active), onPress: () => nav.navigate('MyListings') },
    { icon: 'bag-handle-outline', title: t.headers.purchases, badge: requests.length ? String(requests.length) : undefined, onPress: () => nav.navigate('Purchases') },
    { icon: 'chatbubbles-outline', title: t.profile.messages, onPress: () => notify(t.profile.messages, t.profile.messagesText) },
    { icon: 'notifications-outline', title: t.profile.notifications, onPress: () => notify(t.profile.notifications, t.profile.notificationsText) },
    { icon: 'shield-checkmark-outline', title: t.profile.verification, onPress: () => notify(t.profile.verificationTitle, t.profile.verificationText) },
    {
      icon: 'swap-horizontal-outline',
      title: `${t.profile.role}: ${roleName(user.role)}`,
      onPress: () => {
        const next = user.role === 'seller' ? 'buyer' : 'seller';
        confirm(t.profile.switchRoleQ, t.profile.switchRoleText(roleName(next)), () => setRole(next));
      },
    },
    { icon: 'language-outline', title: `${t.profile.language}: ${t.langName}`, onPress: () => setLangOpen(true) },
    { icon: 'help-circle-outline', title: t.profile.help, onPress: () => notify(t.profile.helpTitle, t.profile.helpText) },
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
          <Text style={st.phone}>{formatPhone(user.phone)}</Text>
          {me.deals > 0 && <Text style={st.phone}>★ {me.rating.toFixed(1)} · {t.common.deals(me.deals)}</Text>}
        </View>
      </View>

      <View style={st.stats}>
        <Stat label={t.profile.active} value={String(active)} />
        <Stat label={t.common.sold} value={String(sold.length)} />
        <Stat label={t.profile.earned} value={earned ? `${Math.round(earned / 1000)}K` : '0'} />
      </View>

      <View style={{ paddingHorizontal: space(4), marginBottom: space(4) }}>
        <Button title={t.common.sellTicket} icon="add-circle-outline" onPress={() => nav.navigate('Sell')} />
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
        <Text style={{ color: colors.red, fontWeight: '700' }}>{t.profile.logout}</Text>
      </Pressable>
      <LanguageSheet visible={langOpen} onClose={() => setLangOpen(false)} />
    </ScrollView>
  );
}

function LanguageSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { lang, setLang, t } = useStore();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={st.backdrop} onPress={onClose}>
        <View style={st.sheet}>
          <Text style={st.sheetTitle}>{t.profile.language}</Text>
          {LANGS.map((l) => (
            <Pressable key={l.id} style={st.sheetRow} onPress={() => { setLang(l.id); onClose(); }}>
              <Text style={[st.sheetRowText, l.id === lang && { color: colors.accent }]}>{l.name}</Text>
              {l.id === lang && <Ionicons name="checkmark" size={20} color={colors.accent} />}
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
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


export function MyListingsScreen({ navigation }: ScreenProps<'MyListings'>) {
  const { listings, t } = useStore();
  const STATUS_TABS: { id: ListingStatus | 'all'; title: string }[] = [
    { id: 'active', title: t.profile.active },
    { id: 'sold', title: t.myListings.sold },
    { id: 'all', title: t.common.all },
  ];
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
              <Text style={st.metaText}><Ionicons name="eye-outline" size={12} /> {t.myListings.views(item.views)}</Text>
              <Badge text={item.status === 'active' ? t.myListings.onSale : item.status === 'sold' ? t.common.sold : t.myListings.draft} color={item.status === 'active' ? colors.green : colors.textDim} />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Empty icon="pricetags-outline" title={t.myListings.empty} text={t.myListings.emptyText}>
            <Button title={t.common.sellTicket} onPress={() => navigation.navigate('Sell')} />
          </Empty>
        }
      />
    </View>
  );
}

export function PurchasesScreen({ navigation }: ScreenProps<'Purchases'>) {
  const { requests, listings, listingView, t } = useStore();
  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: space(4) }}
      data={requests}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => {
        const l = listings.find((x) => x.id === item.listingId);
        if (!l) return null;
        const e = listingView(l);
        return (
          <View style={st.ticket}>
            <Cover image={e.image} style={st.ticketTop}>
              <Text style={st.ticketTitle} numberOfLines={2}>{e.title}</Text>
              {e.date && <Text style={st.ticketMeta}>{formatDate(e.date)}</Text>}
            </Cover>
            <View style={st.ticketBody}>
              {e.venue && <Text style={st.ticketInfo}>{e.venue}</Text>}
              <Text style={st.ticketInfo}>{l.sector}{l.row ? `, ${t.common.rowLower(l.row)}` : ''} · {t.common.pcs(item.qty)}</Text>
              <View style={st.ticketFoot}>
                <Badge text={t.request.processing} color={colors.accent} />
                <Text style={st.ticketPrice}>{formatPrice(item.total)}</Text>
              </View>
            </View>
          </View>
        );
      }}
      ListEmptyComponent={
        <Empty icon="bag-handle-outline" title={t.purchases.empty} text={t.purchases.emptyText}>
          <Button title={t.purchases.browse} variant="secondary" onPress={() => navigation.navigate('Tabs')} />
        </Empty>
      }
    />
  );
}

export function FavoritesTab() {
  const nav = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { favorites, getEvent, t } = useStore();
  const data = favorites.map((id) => getEvent(id)).filter(Boolean) as NonNullable<ReturnType<typeof getEvent>>[];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + space(2) }}>
      <Text style={st.h1}>{t.tabs.favorites}</Text>
      <Text style={st.sub}>{t.favorites.sub}</Text>
      <FlatList
        data={data}
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => <EventRow event={item} onPress={() => nav.navigate('Event', { id: item.id })} />}
        ListEmptyComponent={<Empty icon="heart-outline" title={t.favorites.empty} text={t.favorites.emptyText} />}
      />
    </View>
  );
}

export function LoginScreen({ navigation }: ScreenProps<'Login'>) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space(6) }} keyboardShouldPersistTaps="handled">
      <RegisterForm defaultRole="buyer" onDone={() => navigation.goBack()} />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#000a', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space(5), paddingBottom: space(10) },
  sheetTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginBottom: space(3) },
  sheetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetRowText: { color: colors.text, fontSize: 16, fontWeight: '600' },
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
  ticketTop: { aspectRatio: 16 / 9 },
  ticketTitle: { color: '#fff', fontSize: 16, fontWeight: '800', textShadowColor: '#000000AA', textShadowRadius: 6 },
  ticketMeta: { color: '#ffffffcc', fontSize: 13, marginTop: 2 },
  ticketBody: { padding: space(4) },
  ticketInfo: { color: colors.textDim, fontSize: 14, marginBottom: 4 },
  ticketFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space(2) },
  ticketPrice: { color: colors.text, fontSize: 16, fontWeight: '900' },
});
