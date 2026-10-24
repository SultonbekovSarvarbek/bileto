import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, formatDate, formatPrice, maskPhone, radius, space } from '../theme';
import { SERVICE_FEE } from '../data';
import { useStore } from '../store';
import { tr } from '../i18n';
import { Badge, Button, Card, Empty } from '../components/ui';
import { RequestSheet } from '../components/RequestSheet';
import { Cover, FavoriteButton } from '../components/cards';
import type { ScreenProps } from '../navigation';

export const notify = (title: string, msg?: string) =>
  Platform.OS === 'web' ? window.alert(msg ? `${title}\n\n${msg}` : title) : Alert.alert(title, msg);

export const confirm = (title: string, msg: string, onYes: () => void) => {
  if (Platform.OS === 'web') { if (window.confirm(`${title}\n\n${msg}`)) onYes(); return; }
  Alert.alert(title, msg, [{ text: tr().common.cancel, style: 'cancel' }, { text: tr().common.yes, style: 'destructive', onPress: onYes }]);
};

export default function ListingScreen({ route, navigation }: ScreenProps<'Listing'>) {
  const insets = useSafeAreaInsets();
  const { listings, listingView, getSeller, updateListing, removeListing, t } = useStore();
  const listing = listings.find((l) => l.id === route.params.id);
  const [buying, setBuying] = useState(false);

  if (!listing) return <Empty icon="alert-circle" title={t.listing.deleted} />;
  const v = listingView(listing);
  const seller = getSeller(listing.sellerId);
  const mine = listing.sellerId === 'me';
  const fee = Math.round(listing.price * SERVICE_FEE);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: space(4), paddingBottom: 160 }}>
        <Pressable disabled={!v.eventId} onPress={() => v.eventId && navigation.navigate('Event', { id: v.eventId })}>
          <Cover image={v.image} style={st.eventHead}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <View style={{ flex: 1 }}>
                <Text style={st.eventTitle} numberOfLines={2}>{v.title}</Text>
                {v.date && <Text style={st.eventMeta}>{formatDate(v.date)}</Text>}
                {v.venue && <Text style={st.eventMeta}>{v.venue}</Text>}
              </View>
              {v.eventId && <Ionicons name="chevron-forward" size={20} color="#fff" />}
            </View>
          </Cover>
          <FavoriteButton listingId={listing.id} style={{ position: 'absolute', top: space(3), right: space(3) }} />
        </Pressable>

        <Card style={{ marginTop: space(4) }}>
          <View style={st.rowBetween}>
            <Text style={st.sector}>{listing.sector}</Text>
            {listing.status !== 'active' && <Badge text={listing.status === 'sold' ? t.common.sold : t.listing.reserved} color={colors.textDim} />}
          </View>
          <View style={st.grid}>
            <Cell label={t.listing.row} value={listing.row ?? '—'} />
            <Cell label={t.listing.seats} value={listing.seats ?? '—'} />
            <Cell label={t.listing.available} value={t.common.pcs(listing.qty)} />
            <Cell label={t.listing.transfer} value={t.common[listing.delivery]} />
          </View>
          <View style={st.divider} />
          <View style={st.rowBetween}>
            <View>
              <Text style={st.price}>{formatPrice(listing.price)}</Text>
              <Text style={st.nominal}>{t.listing.perTicket}</Text>
            </View>
          </View>
          {listing.comment ? <Text style={st.comment}>«{listing.comment}»</Text> : null}
        </Card>

        <Card style={{ marginTop: space(3) }}>
          <View style={st.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={st.avatar}><Text style={st.avatarText}>{seller?.name[0]}</Text></View>
              <View style={{ marginLeft: space(3) }}>
                <Text style={st.sellerName}>{mine ? t.listing.you : seller?.name}</Text>
                {seller && <Text style={st.sellerMeta}>{t.listing.sellerMeta(seller.rating.toFixed(1), seller.deals, seller.since)}</Text>}
              </View>
            </View>
            {seller?.verified && <Badge text={t.listing.verified} color={colors.green} />}
          </View>
          {seller && !mine && (
            <View style={st.phoneRow}>
              <Ionicons name="call-outline" size={16} color={colors.textDim} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={st.phoneMasked}>{maskPhone(seller.phone)}</Text>
                <Text style={st.phoneHint}>{t.listing.phoneHidden}</Text>
              </View>
              <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
            </View>
          )}
        </Card>

        <View style={st.safe}>
          <Ionicons name="shield-checkmark" size={22} color={colors.green} />
          <Text style={st.safeText}>
            <Text style={{ fontWeight: '800', color: colors.text }}>{t.listing.safeTitle}</Text>
            {t.listing.safeText}
          </Text>
        </View>

      </ScrollView>

      <View style={[st.bottom, { paddingBottom: insets.bottom + space(3) }]}>
        {mine ? (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {listing.status === 'active' && (
              <>
                <Button style={{ flex: 1 }} title={t.common.edit} variant="secondary" icon="create-outline" onPress={() => navigation.navigate('Sell', { editId: listing.id })} />
                <Button style={{ flex: 1 }} title={t.common.sold} variant="secondary" icon="checkmark-done" onPress={() => updateListing(listing.id, { status: 'sold' })} />
              </>
            )}
            <Button
              style={{ flex: listing.status === 'active' ? 0 : 1, paddingHorizontal: 16 }}
              title={listing.status === 'active' ? '' : t.listing.delete}
              variant="danger"
              icon="trash-outline"
              onPress={() => confirm(t.listing.deleteQ, t.listing.deleteText, () => { removeListing(listing.id); navigation.goBack(); })}
            />
          </View>
        ) : listing.status === 'active' ? (
          <>
            <View style={[st.rowBetween, { marginBottom: 10 }]}>
              <Text style={st.totalLabel}>{t.listing.totalWithFee(Math.round(SERVICE_FEE * 100))}</Text>
              <Text style={st.total}>{formatPrice(listing.price + fee)}</Text>
            </View>
            <Button title={t.listing.buy} icon="cart-outline" onPress={() => setBuying(true)} />
            <RequestSheet listing={listing} visible={buying} onClose={() => setBuying(false)} />
          </>
        ) : (
          <Button title={t.listing.alreadySold} disabled />
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
  eventHead: { aspectRatio: 16 / 9, borderRadius: radius.lg },
  eventTitle: { color: '#fff', fontSize: 18, fontWeight: '800', textShadowColor: '#000000AA', textShadowRadius: 6 },
  eventMeta: { color: '#ffffffdd', fontSize: 13, marginTop: 2, textShadowColor: '#000000AA', textShadowRadius: 6 },
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
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: space(3), paddingTop: space(3), borderTopWidth: 1, borderTopColor: colors.border },
  phoneMasked: { color: colors.text, fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  phoneHint: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space(4), backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { color: colors.textDim, fontSize: 13 },
  total: { color: colors.text, fontSize: 18, fontWeight: '900' },
});
