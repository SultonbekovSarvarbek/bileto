import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, formatDate, formatPrice, radius, space } from '../theme';
import { Event, Listing } from '../data';
import { useStore } from '../store';
import { Badge } from './ui';

export function EventCover({ event, height = 140, big }: { event: Event; height?: number; big?: boolean }) {
  return (
    <View style={[st.cover, { height, backgroundColor: event.color }]}>
      <View style={[st.coverBlob, { backgroundColor: '#ffffff22', right: -30, top: -40 }]} />
      <View style={[st.coverBlob, { backgroundColor: '#00000022', left: -40, bottom: -60 }]} />
      <Text style={{ fontSize: big ? 84 : 52 }}>{event.emoji}</Text>
    </View>
  );
}

export function EventRow({ event, onPress }: { event: Event; onPress: () => void }) {
  const { getVenue, activeListingsFor, t } = useStore();
  const offers = activeListingsFor(event.id);
  return (
    <Pressable onPress={onPress} style={st.eventRow}>
      <View style={[st.thumb, { backgroundColor: event.color }]}>
        <Text style={{ fontSize: 30 }}>{event.emoji}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: space(3) }}>
        <Text numberOfLines={2} style={st.titleSm}>{event.title}</Text>
        <Text numberOfLines={1} style={st.meta}>{formatDate(event.date)} · {getVenue(event.venueId)?.name}</Text>
        <Text style={st.priceSm}>
          {offers.length ? `${t.cards.from(formatPrice(offers[0].price))} · ${t.cards.offers(offers.length)}` : t.cards.noOffers}
        </Text>
      </View>
    </Pressable>
  );
}

export function ListingRow({ listing, onPress, showEvent }: { listing: Listing; onPress: () => void; showEvent?: boolean }) {
  const { getSeller, listingView, t } = useStore();
  const seller = getSeller(listing.sellerId);
  const v = listingView(listing);
  return (
    <Pressable onPress={onPress} style={st.listing}>
      <View style={st.ticketNotchL} />
      <View style={st.ticketNotchR} />
      <View style={{ flex: 1 }}>
        {showEvent && <Text numberOfLines={1} style={st.listingEvent}>{v.emoji} {v.title}</Text>}
        <Text style={st.sector}>{listing.sector}</Text>
        <Text style={st.seat}>
          {[listing.row && t.common.row(listing.row), listing.seats && t.common.seats(listing.seats)].filter(Boolean).join(' · ') || t.cards.noSeat}
          {' · '}{t.common.pcs(listing.qty)}
        </Text>
        <View style={[st.row, { marginTop: 8 }]}>
          <Ionicons name={seller?.verified ? 'shield-checkmark' : 'person-circle-outline'} size={14} color={seller?.verified ? colors.green : colors.textDim} />
          <Text style={st.seller}>{seller?.name} · ★ {seller?.rating.toFixed(1)}</Text>
        </View>
      </View>
      <View style={st.dash} />
      <View style={{ alignItems: 'flex-end', minWidth: 110 }}>
        <Text style={st.listPrice}>{formatPrice(listing.price)}</Text>
        <View style={{ marginTop: 6 }}><Badge text={t.common[listing.delivery]} color={listing.delivery === 'delivery' ? colors.accent : colors.blue} /></View>
      </View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  cover: { borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  coverBlob: { position: 'absolute', width: 160, height: 160, borderRadius: 80 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eventRow: { flexDirection: 'row', padding: space(3), marginHorizontal: space(4), marginBottom: space(3), backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  thumb: { width: 84, height: 96, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  titleSm: { color: colors.text, fontSize: 15, fontWeight: '700' },
  meta: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  priceSm: { color: colors.accent, fontSize: 13, fontWeight: '700', marginTop: 6 },
  listing: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: space(4), marginHorizontal: space(4), marginBottom: space(3), overflow: 'hidden' },
  ticketNotchL: { position: 'absolute', left: -9, top: '50%', width: 18, height: 18, borderRadius: 9, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  ticketNotchR: { position: 'absolute', right: -9, top: '50%', width: 18, height: 18, borderRadius: 9, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  listingEvent: { color: colors.textDim, fontSize: 12, marginBottom: 4 },
  sector: { color: colors.text, fontSize: 16, fontWeight: '800' },
  seat: { color: colors.textDim, fontSize: 13, marginTop: 3 },
  seller: { color: colors.textDim, fontSize: 12, marginLeft: 4, flex: 1 },
  dash: { width: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderStyle: 'dashed', borderColor: colors.border, marginHorizontal: space(3) },
  listPrice: { color: colors.text, fontSize: 17, fontWeight: '800' },
});
