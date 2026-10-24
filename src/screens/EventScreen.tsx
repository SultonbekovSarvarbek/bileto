import React, { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, formatDate, formatPrice, space } from '../theme';
import { useStore } from '../store';
import { Badge, Button, Empty } from '../components/ui';
import { EventCover, ListingRow } from '../components/cards';
import type { ScreenProps } from '../navigation';

export default function EventScreen({ route, navigation }: ScreenProps<'Event'>) {
  const insets = useSafeAreaInsets();
  const { getEvent, getVenue, activeListingsFor, favorites, toggleFavorite, t } = useStore();
  const event = getEvent(route.params.id);

  const fav = event ? favorites.includes(event.id) : false;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        event ? (
          <Pressable onPress={() => toggleFavorite(event.id)} hitSlop={10}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={24} color={fav ? colors.red : colors.text} />
          </Pressable>
        ) : null,
    });
  }, [navigation, fav, event, toggleFavorite]);

  if (!event) return <Empty icon="alert-circle" title={t.event.notFound} />;
  const venue = getVenue(event.venueId);
  const offers = activeListingsFor(event.id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ padding: space(4) }}>
          <EventCover event={event} height={200} big />
          {event.soldOut && <View style={{ marginTop: space(4) }}><Badge text={t.event.boxSoldOut} color={colors.red} /></View>}
          <Text style={st.title}>{event.title}</Text>
          <Info icon="calendar-outline" text={formatDate(event.date)} />
          <Info icon="location-outline" text={`${venue?.name}, ${venue ? t.cities[venue.city] ?? venue.city : ''}`} />
          <Info icon="pricetags-outline" text={t.event.boxPrice(formatPrice(event.officialMin), formatPrice(event.officialMax))} />
          <Text style={st.desc}>{event.description}</Text>
        </View>

        <View style={st.offersHead}>
          <Text style={st.h2}>{t.event.fromPeople}</Text>
          <Text style={st.count}>{offers.length}</Text>
        </View>
        {offers.map((l) => (
          <ListingRow key={l.id} listing={l} onPress={() => navigation.navigate('Listing', { id: l.id })} />
        ))}
        {!offers.length && (
          <Empty icon="ticket-outline" title={t.event.noneSelling} text={t.event.noneSellingText}>
            <Button title={t.event.notifyMe} variant="secondary" icon="notifications-outline" onPress={() => toggleFavorite(event.id)} />
          </Empty>
        )}
      </ScrollView>
      <View style={[st.bottom, { paddingBottom: insets.bottom + space(3) }]}>
        <Button title={t.event.haveTicket} icon="add-circle-outline" onPress={() => navigation.navigate('Sell', { eventId: event.id })} />
      </View>
    </View>
  );
}

function Info({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={st.info}>
      <Ionicons name={icon} size={18} color={colors.textDim} />
      <Text style={st.infoText}>{text}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  title: { color: colors.text, fontSize: 26, fontWeight: '900', marginTop: space(3), marginBottom: space(3), lineHeight: 32 },
  info: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { color: colors.text, fontSize: 15, marginLeft: 10, flex: 1 },
  desc: { color: colors.textDim, fontSize: 15, lineHeight: 22, marginTop: space(2) },
  offersHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space(4), marginTop: space(2), marginBottom: space(3) },
  h2: { color: colors.text, fontSize: 20, fontWeight: '800' },
  count: { color: colors.accentText, backgroundColor: colors.accent, fontWeight: '800', fontSize: 13, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginLeft: 8, overflow: 'hidden' },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space(4), backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
});
