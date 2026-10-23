import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, formatDate, formatPrice, formatShortDate, radius, space } from '../theme';
import { Event, Listing, CATEGORIES } from '../data';
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

export function EventCardWide({ event, onPress }: { event: Event; onPress: () => void }) {
  const { getVenue, activeListingsFor, favorites, toggleFavorite } = useStore();
  const offers = activeListingsFor(event.id);
  const minPrice = offers[0]?.price;
  const fav = favorites.includes(event.id);
  const { day, month } = formatShortDate(event.date);
  return (
    <Pressable onPress={onPress} style={st.wide}>
      <View>
        <EventCover event={event} height={150} />
        <View style={st.dateTag}>
          <Text style={st.dateDay}>{day}</Text>
          <Text style={st.dateMonth}>{month}</Text>
        </View>
        <Pressable onPress={() => toggleFavorite(event.id)} style={st.favBtn} hitSlop={8}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? colors.red : '#fff'} />
        </Pressable>
        {event.soldOut && <View style={st.soldOut}><Text style={st.soldOutText}>SOLD OUT в кассе</Text></View>}
      </View>
      <View style={{ padding: space(3) }}>
        <Text numberOfLines={2} style={st.title}>{event.title}</Text>
        <Text numberOfLines={1} style={st.venue}>{getVenue(event.venueId)?.name}</Text>
        <View style={st.row}>
          <Text style={st.price}>{minPrice ? `от ${formatPrice(minPrice)}` : 'Пока нет предложений'}</Text>
          {offers.length > 0 && <Text style={st.offers}>{offers.length} предл.</Text>}
        </View>
      </View>
    </Pressable>
  );
}

export function EventRow({ event, onPress }: { event: Event; onPress: () => void }) {
  const { getVenue, activeListingsFor } = useStore();
  const offers = activeListingsFor(event.id);
  const cat = CATEGORIES.find((c) => c.id === event.category);
  return (
    <Pressable onPress={onPress} style={st.eventRow}>
      <View style={[st.thumb, { backgroundColor: event.color }]}>
        <Text style={{ fontSize: 30 }}>{event.emoji}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: space(3) }}>
        <Text style={[st.cat, { color: cat?.color }]}>{cat?.title}</Text>
        <Text numberOfLines={2} style={st.titleSm}>{event.title}</Text>
        <Text numberOfLines={1} style={st.meta}>{formatDate(event.date)} · {getVenue(event.venueId)?.name}</Text>
        <Text style={st.priceSm}>
          {offers.length ? `от ${formatPrice(offers[0].price)} · ${offers.length} предл.` : 'Нет предложений'}
        </Text>
      </View>
    </Pressable>
  );
}

export function markupInfo(l: Listing) {
  const diff = (l.price - l.nominal) / l.nominal;
  if (diff <= 0) return { text: 'по номиналу', color: colors.green };
  return { text: `+${Math.round(diff * 100)}% к номиналу`, color: diff > 0.3 ? colors.red : colors.accent };
}

export function ListingRow({ listing, onPress, showEvent }: { listing: Listing; onPress: () => void; showEvent?: boolean }) {
  const { getSeller, getEvent } = useStore();
  const seller = getSeller(listing.sellerId);
  const ev = getEvent(listing.eventId);
  const m = markupInfo(listing);
  return (
    <Pressable onPress={onPress} style={st.listing}>
      <View style={st.ticketNotchL} />
      <View style={st.ticketNotchR} />
      <View style={{ flex: 1 }}>
        {showEvent && ev && <Text numberOfLines={1} style={st.listingEvent}>{ev.emoji} {ev.title}</Text>}
        <Text style={st.sector}>{listing.sector}</Text>
        <Text style={st.seat}>
          {[listing.row && `Ряд ${listing.row}`, listing.seats && `Места ${listing.seats}`].filter(Boolean).join(' · ') || 'Без места'}
          {' · '}{listing.qty} шт.
        </Text>
        <View style={[st.row, { marginTop: 8 }]}>
          <Ionicons name={seller?.verified ? 'shield-checkmark' : 'person-circle-outline'} size={14} color={seller?.verified ? colors.green : colors.textDim} />
          <Text style={st.seller}>{seller?.name} · ★ {seller?.rating.toFixed(1)}</Text>
        </View>
      </View>
      <View style={st.dash} />
      <View style={{ alignItems: 'flex-end', minWidth: 110 }}>
        <Text style={st.listPrice}>{formatPrice(listing.price)}</Text>
        <Text style={st.nominal}>номинал {formatPrice(listing.nominal)}</Text>
        <View style={{ marginTop: 6 }}><Badge text={m.text} color={m.color} /></View>
      </View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  cover: { borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  coverBlob: { position: 'absolute', width: 160, height: 160, borderRadius: 80 },
  wide: { width: 260, marginRight: space(3), backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  dateTag: { position: 'absolute', left: 10, top: 10, backgroundColor: colors.bg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center' },
  dateDay: { color: colors.text, fontSize: 18, fontWeight: '800' },
  dateMonth: { color: colors.textDim, fontSize: 11, fontWeight: '700', marginTop: -2 },
  favBtn: { position: 'absolute', right: 10, top: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: '#00000055', alignItems: 'center', justifyContent: 'center' },
  soldOut: { position: 'absolute', left: 10, bottom: 10, backgroundColor: colors.red, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  soldOutText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  title: { color: colors.text, fontSize: 16, fontWeight: '700', minHeight: 40 },
  venue: { color: colors.textDim, fontSize: 13, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { color: colors.accent, fontSize: 15, fontWeight: '800', marginTop: 8 },
  offers: { color: colors.textDim, fontSize: 12, marginTop: 8 },
  eventRow: { flexDirection: 'row', padding: space(3), marginHorizontal: space(4), marginBottom: space(3), backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  thumb: { width: 84, height: 96, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  cat: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  titleSm: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 2 },
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
  nominal: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
});
