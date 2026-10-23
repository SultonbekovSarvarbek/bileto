import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, formatDate, formatPrice, radius, space } from '../theme';
import { SERVICE_FEE } from '../data';
import { useStore } from '../store';
import { Button, Card } from '../components/ui';
import type { ScreenProps } from '../navigation';

const METHODS = [
  { id: 'payme', title: 'Payme', icon: 'wallet-outline' },
  { id: 'click', title: 'Click', icon: 'phone-portrait-outline' },
  { id: 'uzcard', title: 'Карта Uzcard / Humo', icon: 'card-outline' },
  { id: 'visa', title: 'Visa / Mastercard', icon: 'globe-outline' },
] as const;

export default function CheckoutScreen({ route, navigation }: ScreenProps<'Checkout'>) {
  const insets = useSafeAreaInsets();
  const { listings, getEvent, getVenue, buy } = useStore();
  const listing = listings.find((l) => l.id === route.params.id)!;
  const event = getEvent(listing.eventId)!;
  const qty = route.params.qty;
  const [method, setMethod] = useState<string>('payme');
  const [paying, setPaying] = useState(false);

  const subtotal = listing.price * qty;
  const fee = Math.round(subtotal * SERVICE_FEE);
  const total = subtotal + fee;

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      buy(listing.id, qty, total);
      navigation.replace('Done', { kind: 'bought', id: listing.id });
    }, 900);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: space(4), paddingBottom: 140 }}>
        <Card>
          <Text style={st.eventTitle}>{event.emoji} {event.title}</Text>
          <Text style={st.meta}>{formatDate(event.date)} · {getVenue(event.venueId)?.name}</Text>
          <Text style={st.meta}>{listing.sector}{listing.row ? `, ряд ${listing.row}` : ''}{listing.seats ? `, места ${listing.seats}` : ''}</Text>
          <View style={st.divider} />
          <Line label={`Билеты × ${qty}`} value={formatPrice(subtotal)} />
          <Line label={`Сервисный сбор ${Math.round(SERVICE_FEE * 100)}%`} value={formatPrice(fee)} />
          <View style={st.divider} />
          <Line label="К оплате" value={formatPrice(total)} bold />
        </Card>

        <Text style={st.h2}>Способ оплаты</Text>
        {METHODS.map((m) => (
          <Pressable key={m.id} onPress={() => setMethod(m.id)} style={[st.method, method === m.id && { borderColor: colors.accent }]}>
            <Ionicons name={m.icon} size={22} color={colors.text} />
            <Text style={st.methodText}>{m.title}</Text>
            <Ionicons name={method === m.id ? 'radio-button-on' : 'radio-button-off'} size={22} color={method === m.id ? colors.accent : colors.textMuted} />
          </Pressable>
        ))}

        <View style={st.steps}>
          {[
            ['lock-closed', 'Деньги замораживаются на счёте сервиса'],
            ['paper-plane', 'Продавец передаёт билет в течение 2 часов'],
            ['qr-code', 'Билет появляется в «Мои покупки», вы проверяете его'],
            ['cash', 'Только после этого продавец получает оплату'],
          ].map(([icon, text], i) => (
            <View key={i} style={st.step}>
              <View style={st.stepIcon}><Ionicons name={icon as any} size={16} color={colors.accent} /></View>
              <Text style={st.stepText}>{text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={[st.bottom, { paddingBottom: insets.bottom + space(3) }]}>
        <Button title={paying ? 'Оплата…' : `Оплатить ${formatPrice(total)}`} icon="lock-closed" disabled={paying} onPress={pay} />
      </View>
    </View>
  );
}

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={st.line}>
      <Text style={[st.lineLabel, bold && { color: colors.text, fontWeight: '800', fontSize: 16 }]}>{label}</Text>
      <Text style={[st.lineValue, bold && { fontSize: 18, fontWeight: '900' }]}>{value}</Text>
    </View>
  );
}

export function DoneScreen({ route, navigation }: ScreenProps<'Done'>) {
  const { listings, getEvent } = useStore();
  const listing = listings.find((l) => l.id === route.params.id);
  const event = listing ? getEvent(listing.eventId) : undefined;
  const bought = route.params.kind === 'bought';
  return (
    <View style={[st.done, { backgroundColor: colors.bg }]}>
      <View style={st.doneIcon}><Ionicons name={bought ? 'checkmark' : 'megaphone'} size={44} color={colors.accentText} /></View>
      <Text style={st.doneTitle}>{bought ? 'Оплата прошла!' : 'Объявление опубликовано'}</Text>
      <Text style={st.doneText}>
        {bought
          ? `Продавец уже получил уведомление и передаст билет на «${event?.title}». Мы сообщим, когда он появится в «Мои покупки».`
          : `Ваш билет на «${event?.title}» теперь видят покупатели. Как только кто-то оплатит — вы получите уведомление.`}
      </Text>
      <Button
        style={{ alignSelf: 'stretch', marginTop: space(6) }}
        title={bought ? 'Мои покупки' : 'Мои объявления'}
        onPress={() => navigation.reset({ index: 1, routes: [{ name: 'Tabs' }, { name: bought ? 'Purchases' : 'MyListings' }] })}
      />
      <Button style={{ alignSelf: 'stretch', marginTop: space(3) }} title="На главную" variant="ghost" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] })} />
    </View>
  );
}

const st = StyleSheet.create({
  eventTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  meta: { color: colors.textDim, fontSize: 13, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: space(3) },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  lineLabel: { color: colors.textDim, fontSize: 14 },
  lineValue: { color: colors.text, fontSize: 15, fontWeight: '700' },
  h2: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: space(6), marginBottom: space(3) },
  method: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: space(4), marginBottom: space(2) },
  methodText: { color: colors.text, fontSize: 16, fontWeight: '600', flex: 1, marginLeft: 12 },
  steps: { marginTop: space(5) },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: space(3) },
  stepIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2A2410', alignItems: 'center', justifyContent: 'center' },
  stepText: { color: colors.textDim, fontSize: 14, marginLeft: 12, flex: 1 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space(4), backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
  done: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space(6) },
  doneIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  doneTitle: { color: colors.text, fontSize: 26, fontWeight: '900', marginTop: space(5), textAlign: 'center' },
  doneText: { color: colors.textDim, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: space(3) },
});
