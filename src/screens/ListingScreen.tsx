import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, formatDate, formatPrice, radius, space } from '../theme';
import { SERVICE_FEE } from '../data';
import { useStore } from '../store';
import { Badge, Button, Card, Empty } from '../components/ui';
import { markupInfo } from '../components/cards';
import type { ScreenProps } from '../navigation';

export const notify = (title: string, msg?: string) =>
  Platform.OS === 'web' ? window.alert(msg ? `${title}\n\n${msg}` : title) : Alert.alert(title, msg);

export const confirm = (title: string, msg: string, onYes: () => void) => {
  if (Platform.OS === 'web') { if (window.confirm(`${title}\n\n${msg}`)) onYes(); return; }
  Alert.alert(title, msg, [{ text: 'Отмена', style: 'cancel' }, { text: 'Да', style: 'destructive', onPress: onYes }]);
};

export default function ListingScreen({ route, navigation }: ScreenProps<'Listing'>) {
  const insets = useSafeAreaInsets();
  const { listings, getEvent, getVenue, getSeller, user, updateListing, removeListing } = useStore();
  const listing = listings.find((l) => l.id === route.params.id);
  const [qty, setQty] = useState(1);

  if (!listing) return <Empty icon="alert-circle" title="Объявление удалено" />;
  const event = getEvent(listing.eventId)!;
  const venue = getVenue(event.venueId);
  const seller = getSeller(listing.sellerId);
  const mine = listing.sellerId === 'me';
  const m = markupInfo(listing);
  const subtotal = listing.price * qty;
  const fee = Math.round(subtotal * SERVICE_FEE);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: space(4), paddingBottom: 160 }}>
        <Pressable onPress={() => navigation.navigate('Event', { id: event.id })} style={[st.eventHead, { backgroundColor: event.color }]}>
          <Text style={{ fontSize: 40 }}>{event.emoji}</Text>
          <View style={{ flex: 1, marginLeft: space(3) }}>
            <Text style={st.eventTitle} numberOfLines={2}>{event.title}</Text>
            <Text style={st.eventMeta}>{formatDate(event.date)}</Text>
            <Text style={st.eventMeta}>{venue?.name}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </Pressable>

        <Card style={{ marginTop: space(4) }}>
          <View style={st.rowBetween}>
            <Text style={st.sector}>{listing.sector}</Text>
            {listing.status !== 'active' && <Badge text={listing.status === 'sold' ? 'Продано' : 'Резерв'} color={colors.textDim} />}
          </View>
          <View style={st.grid}>
            <Cell label="Ряд" value={listing.row ?? '—'} />
            <Cell label="Места" value={listing.seats ?? '—'} />
            <Cell label="Доступно" value={`${listing.qty} шт.`} />
            <Cell label="Тип" value={listing.ticketType === 'electronic' ? 'Электронный' : 'Бумажный'} />
          </View>
          <View style={st.divider} />
          <View style={st.rowBetween}>
            <View>
              <Text style={st.price}>{formatPrice(listing.price)}</Text>
              <Text style={st.nominal}>за билет · номинал {formatPrice(listing.nominal)}</Text>
            </View>
            <Badge text={m.text} color={m.color} />
          </View>
          {listing.comment ? <Text style={st.comment}>«{listing.comment}»</Text> : null}
        </Card>

        <Card style={{ marginTop: space(3) }}>
          <View style={st.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={st.avatar}><Text style={st.avatarText}>{seller?.name[0]}</Text></View>
              <View style={{ marginLeft: space(3) }}>
                <Text style={st.sellerName}>{mine ? 'Вы' : seller?.name}</Text>
                <Text style={st.sellerMeta}>★ {seller?.rating.toFixed(1)} · {seller?.deals} сделок · с {seller?.since}</Text>
              </View>
            </View>
            {seller?.verified && <Badge text="Проверен" color={colors.green} />}
          </View>
        </Card>

        <View style={st.safe}>
          <Ionicons name="shield-checkmark" size={22} color={colors.green} />
          <Text style={st.safeText}>
            <Text style={{ fontWeight: '800', color: colors.text }}>Безопасная сделка. </Text>
            Деньги замораживаются и уходят продавцу только после того, как билет передан вам и проверен. Если билет не пришёл — полный возврат.
          </Text>
        </View>

        {!mine && listing.status === 'active' && listing.qty > 1 && (
          <View style={[st.rowBetween, { marginTop: space(4) }]}>
            <Text style={st.qtyLabel}>Количество</Text>
            <View style={st.stepper}>
              <Pressable onPress={() => setQty((q) => Math.max(1, q - 1))} style={st.stepBtn}><Ionicons name="remove" size={20} color={colors.text} /></Pressable>
              <Text style={st.qty}>{qty}</Text>
              <Pressable onPress={() => setQty((q) => Math.min(listing.qty, q + 1))} style={st.stepBtn}><Ionicons name="add" size={20} color={colors.text} /></Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[st.bottom, { paddingBottom: insets.bottom + space(3) }]}>
        {mine ? (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {listing.status === 'active' && (
              <>
                <Button style={{ flex: 1 }} title="Изменить" variant="secondary" icon="create-outline" onPress={() => navigation.navigate('Sell', { editId: listing.id })} />
                <Button style={{ flex: 1 }} title="Продано" variant="secondary" icon="checkmark-done" onPress={() => updateListing(listing.id, { status: 'sold' })} />
              </>
            )}
            <Button
              style={{ flex: listing.status === 'active' ? 0 : 1, paddingHorizontal: 16 }}
              title={listing.status === 'active' ? '' : 'Удалить'}
              variant="danger"
              icon="trash-outline"
              onPress={() => confirm('Удалить объявление?', 'Это действие нельзя отменить', () => { removeListing(listing.id); navigation.goBack(); })}
            />
          </View>
        ) : listing.status === 'active' ? (
          <>
            <View style={[st.rowBetween, { marginBottom: 10 }]}>
              <Text style={st.totalLabel}>Итого с сервисным сбором {Math.round(SERVICE_FEE * 100)}%</Text>
              <Text style={st.total}>{formatPrice(subtotal + fee)}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button title="" variant="secondary" icon="chatbubble-ellipses-outline" style={{ paddingHorizontal: 16 }} onPress={() => notify('Чат с продавцом', 'Здесь будет переписка внутри приложения. Контакты не раскрываются до оплаты.')} />
              <Button
                style={{ flex: 1 }}
                title="Купить"
                icon="lock-closed"
                onPress={() => (user ? navigation.navigate('Checkout', { id: listing.id, qty }) : navigation.navigate('Login'))}
              />
            </View>
          </>
        ) : (
          <Button title="Билеты уже проданы" disabled />
        )}
      </View>
    </View>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <View style={st.cell}>
      <Text style={st.cellLabel}>{label}</Text>
      <Text style={st.cellValue}>{value}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  eventHead: { flexDirection: 'row', alignItems: 'center', padding: space(4), borderRadius: radius.lg },
  eventTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  eventMeta: { color: '#ffffffcc', fontSize: 13, marginTop: 2 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sector: { color: colors.text, fontSize: 22, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: space(3) },
  cell: { width: '50%', marginBottom: space(3) },
  cellLabel: { color: colors.textMuted, fontSize: 12 },
  cellValue: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: space(2) },
  price: { color: colors.text, fontSize: 24, fontWeight: '900' },
  nominal: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  comment: { color: colors.textDim, fontSize: 14, fontStyle: 'italic', marginTop: space(3), lineHeight: 20 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.accent, fontSize: 18, fontWeight: '800' },
  sellerName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  sellerMeta: { color: colors.textDim, fontSize: 12, marginTop: 2 },
  safe: { flexDirection: 'row', marginTop: space(3), padding: space(4), borderRadius: radius.lg, backgroundColor: '#12291F', borderWidth: 1, borderColor: '#1E4634' },
  safeText: { color: colors.textDim, fontSize: 13, lineHeight: 19, marginLeft: 10, flex: 1 },
  qtyLabel: { color: colors.text, fontSize: 16, fontWeight: '700' },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border },
  stepBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  qty: { color: colors.text, fontSize: 17, fontWeight: '800', minWidth: 28, textAlign: 'center' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space(4), backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { color: colors.textDim, fontSize: 13 },
  total: { color: colors.text, fontSize: 18, fontWeight: '900' },
});
