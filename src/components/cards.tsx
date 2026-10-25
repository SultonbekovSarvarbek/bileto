import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, formatDate, formatPrice, radius, space } from '../theme';
import { Event, Listing } from '../data';
import { useStore } from '../store';
import { Badge } from './ui';

// Обложка: фото события. Затемнение низа под текст уже «впечено» в файлы assets/covers. Без фото — знак Bileto на тёмном фоне.
export function Cover({ image, style, children }: { image?: ImageSourcePropType; style?: ViewStyle; children?: React.ReactNode }) {
  if (!image) {
    return (
      <View style={[st.cover, st.coverEmpty, style]}>
        <Image source={require('../../assets/logo-mark.png')} style={st.coverMark} />
        {children && <View style={st.coverContent}>{children}</View>}
      </View>
    );
  }
  return (
    <View style={[st.cover, style]}>
      <Image source={image} style={st.fill} resizeMode="cover" />
      {children && (
        <View style={st.coverContent}>{children}</View>
      )}
    </View>
  );
}

// Сердечко «в избранное» поверх обложки объявления.
export function FavoriteButton({ listingId, style }: { listingId: string; style?: ViewStyle }) {
  const { favorites, toggleFavorite } = useStore();
  const fav = favorites.includes(listingId);
  return (
    <Pressable onPress={() => toggleFavorite(listingId)} hitSlop={8} style={[st.favBtn, style]}>
      <Ionicons name={fav ? 'heart' : 'heart-outline'} size={20} color={fav ? colors.red : '#fff'} />
    </Pressable>
  );
}

export function EventCover({ event, height = 140 }: { event: Event; height?: number }) {
  return <Cover image={event.image} style={{ height, borderRadius: radius.lg }} />;
}

export function EventRow({ event, onPress }: { event: Event; onPress: () => void }) {
  const { getVenue, activeListingsFor, t } = useStore();
  const offers = activeListingsFor(event.id);
  return (
    <Pressable onPress={onPress} style={st.eventRow}>
      <Image source={event.image} style={st.thumb} />
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
      {showEvent && (
        <Cover image={v.image} style={st.listingCover}>
          <Text numberOfLines={2} style={st.coverTitle}>{v.title}</Text>
          {v.date && <Text numberOfLines={1} style={st.coverMeta}>{formatDate(v.date)}{v.venue ? ` · ${v.venue}` : ''}</Text>}
        </Cover>
      )}
      {showEvent && <FavoriteButton listingId={listing.id} style={st.favOnCover} />}
      <View style={st.stub}>
        <View style={st.ticketNotchL} />
        <View style={st.ticketNotchR} />
        <View style={{ flex: 1 }}>
          <Text style={st.sector}>{listing.sector}</Text>
          <Text style={st.seat}>
            {[listing.row && t.common.row(listing.row), listing.seats && t.common.seats(listing.seats)].filter(Boolean).join(' · ') || t.cards.noSeat}
            {' · '}{t.common.pcs(listing.qty)}
          </Text>
          <View style={[st.row, { marginTop: 8 }]}>
            <Ionicons name={seller?.verified ? 'shield-checkmark' : 'person-circle-outline'} size={14} color={seller?.verified ? colors.green : colors.textDim} />
            <Text style={st.seller}>{seller?.name}</Text>
          </View>
        </View>
        <View style={st.dash} />
        <View style={{ alignItems: 'flex-end', minWidth: 110 }}>
          <Text style={st.listPrice}>{formatPrice(listing.price)}</Text>
          <View style={{ marginTop: 6 }}><Badge text={t.common[listing.delivery]} color={listing.delivery === 'delivery' ? colors.accent : colors.blue} /></View>
        </View>
      </View>
    </Pressable>
  );
}

const st = StyleSheet.create({
  cover: { overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.surface2 },
  coverEmpty: { alignItems: 'center', justifyContent: 'center' },
  coverMark: { width: 72, height: 50, resizeMode: 'contain', opacity: 0.35 },
  fill: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  coverContent: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space(3) },
  coverTitle: { color: '#fff', fontSize: 16, fontWeight: '800', textShadowColor: '#000000AA', textShadowRadius: 6 },
  coverMeta: { color: '#ffffffDD', fontSize: 12, marginTop: 2, textShadowColor: '#000000AA', textShadowRadius: 6 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eventRow: { flexDirection: 'row', padding: space(3), marginHorizontal: space(4), marginBottom: space(3), backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  thumb: { width: 84, height: 96, borderRadius: radius.md, backgroundColor: colors.surface2 },
  titleSm: { color: colors.text, fontSize: 15, fontWeight: '700' },
  meta: { color: colors.textDim, fontSize: 12, marginTop: 4 },
  priceSm: { color: colors.accent, fontSize: 13, fontWeight: '700', marginTop: 6 },
  favBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#00000066', alignItems: 'center', justifyContent: 'center' },
  favOnCover: { position: 'absolute', top: space(3), right: space(3) },
  listing: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginHorizontal: space(4), marginBottom: space(3), overflow: 'hidden' },
  // Обложки 16:9, как сами файлы: затемнённый низ кадра всегда под текстом.
  listingCover: { aspectRatio: 16 / 9 },
  stub: { flexDirection: 'row', alignItems: 'center', padding: space(4) },
  ticketNotchL: { position: 'absolute', left: -9, top: '50%', marginTop: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  ticketNotchR: { position: 'absolute', right: -9, top: '50%', width: 18, height: 18, borderRadius: 9, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  sector: { color: colors.text, fontSize: 16, fontWeight: '800' },
  seat: { color: colors.textDim, fontSize: 13, marginTop: 3 },
  seller: { color: colors.textDim, fontSize: 12, marginLeft: 4, flex: 1 },
  dash: { width: 1, alignSelf: 'stretch', borderLeftWidth: 1, borderStyle: 'dashed', borderColor: colors.border, marginHorizontal: space(3) },
  listPrice: { color: colors.text, fontSize: 17, fontWeight: '800' },
});
