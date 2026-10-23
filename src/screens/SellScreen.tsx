import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, formatDate, formatPrice, radius, space } from '../theme';
import { CATEGORIES, MAX_MARKUP, TicketType } from '../data';
import { useStore } from '../store';
import { Button, Chip, Field } from '../components/ui';
import { notify } from './ListingScreen';
import type { ScreenProps } from '../navigation';

const onlyDigits = (s: string) => s.replace(/\D/g, '');
const num = (s: string) => Number(onlyDigits(s) || 0);
const pretty = (s: string) => (onlyDigits(s) ? Number(onlyDigits(s)).toLocaleString('ru-RU').replace(/,/g, ' ') : '');

export default function SellScreen({ route, navigation }: ScreenProps<'Sell'>) {
  const insets = useSafeAreaInsets();
  const { events, getVenue, addListing, updateListing, listings, user, city } = useStore();
  const editing = route.params?.editId ? listings.find((l) => l.id === route.params!.editId) : undefined;

  const [eventId, setEventId] = useState<string | undefined>(editing?.eventId ?? route.params?.eventId);
  const [eventQuery, setEventQuery] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [sector, setSector] = useState(editing?.sector ?? '');
  const [row, setRow] = useState(editing?.row ?? '');
  const [seats, setSeats] = useState(editing?.seats ?? '');
  const [qty, setQty] = useState(editing?.qty ?? 1);
  const [ticketType, setTicketType] = useState<TicketType>(editing?.ticketType ?? 'electronic');
  const [nominal, setNominal] = useState(editing ? String(editing.nominal) : '');
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [comment, setComment] = useState(editing?.comment ?? '');
  const [proof, setProof] = useState<string | null>(editing ? 'existing' : null);
  const [agree, setAgree] = useState(!!editing);
  const [tried, setTried] = useState(false);

  const event = events.find((e) => e.id === eventId);
  const pickable = useMemo(
    () =>
      events.filter((e) => {
        if (getVenue(e.venueId)?.city !== city) return false;
        if (catFilter !== 'all' && e.category !== catFilter) return false;
        const q = eventQuery.trim().toLowerCase();
        return !q || e.title.toLowerCase().includes(q);
      }),
    [events, city, catFilter, eventQuery, getVenue],
  );

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, padding: space(6), justifyContent: 'center' }}>
        <Text style={st.h1}>Войдите, чтобы продать билет</Text>
        <Button title="Войти по номеру телефона" onPress={() => navigation.replace('Login')} style={{ marginTop: space(6) }} />
      </View>
    );
  }

  const nominalN = num(nominal);
  const priceN = num(price);
  const maxPrice = Math.round(nominalN * (1 + MAX_MARKUP));
  const errors = {
    event: !eventId ? 'Выберите событие' : '',
    sector: !sector.trim() ? 'Укажите сектор или зону' : '',
    nominal: !nominalN ? 'Укажите цену, указанную на билете' : '',
    price: !priceN ? 'Укажите вашу цену' : nominalN && priceN > maxPrice ? `Максимум ${formatPrice(maxPrice)} (номинал +${MAX_MARKUP * 100}%)` : '',
    proof: !proof ? 'Загрузите фото или скрин билета — его увидит только модератор' : '',
    agree: !agree ? 'Нужно согласие с правилами' : '',
  };
  const valid = Object.values(errors).every((e) => !e);

  const pickProof = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!res.canceled) setProof(res.assets[0].uri);
  };

  const submit = () => {
    setTried(true);
    if (!valid) {
      notify('Проверьте форму', Object.values(errors).filter(Boolean)[0]);
      return;
    }
    const payload = { eventId: eventId!, sector: sector.trim(), row: row.trim() || undefined, seats: seats.trim() || undefined, qty, nominal: nominalN, price: priceN, ticketType, comment: comment.trim() || undefined };
    if (editing) {
      updateListing(editing.id, payload);
      navigation.goBack();
    } else {
      const created = addListing(payload);
      navigation.replace('Done', { kind: 'listed', id: created.id });
    }
  };

  const err = (k: keyof typeof errors) => (tried ? errors[k] : '');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: space(4), paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        {/* 1. Событие */}
        <Step n={1} title="Событие" />
        {event ? (
          <Pressable onPress={() => !editing && setEventId(undefined)} style={[st.selected, { borderColor: event.color }]}>
            <View style={[st.selThumb, { backgroundColor: event.color }]}><Text style={{ fontSize: 26 }}>{event.emoji}</Text></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={st.selTitle} numberOfLines={2}>{event.title}</Text>
              <Text style={st.selMeta}>{formatDate(event.date)} · {getVenue(event.venueId)?.name}</Text>
            </View>
            {!editing && <Text style={st.change}>Изменить</Text>}
          </Pressable>
        ) : (
          <>
            <View style={st.search}>
              <Ionicons name="search" size={18} color={colors.textMuted} />
              <TextInput value={eventQuery} onChangeText={setEventQuery} placeholder="Найти событие" placeholderTextColor={colors.textMuted} style={st.searchInput} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: space(3) }}>
              <Chip label="Все" active={catFilter === 'all'} onPress={() => setCatFilter('all')} />
              {CATEGORIES.map((c) => <Chip key={c.id} label={c.title} active={catFilter === c.id} onPress={() => setCatFilter(c.id)} />)}
            </ScrollView>
            {pickable.map((e) => (
              <Pressable key={e.id} onPress={() => setEventId(e.id)} style={st.pickRow}>
                <Text style={{ fontSize: 22, marginRight: 10 }}>{e.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={st.pickTitle} numberOfLines={1}>{e.title}</Text>
                  <Text style={st.selMeta}>{formatDate(e.date)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
            {!pickable.length && <Text style={st.hint}>Не нашли событие? Напишите в поддержку — добавим за 15 минут.</Text>}
            {!!err('event') && <Text style={st.error}>{err('event')}</Text>}
          </>
        )}

        {/* 2. Билет */}
        <Step n={2} title="Данные билета" />
        <Field label="Сектор / зона *" value={sector} onChangeText={setSector} placeholder="Напр. Партер, Танцпол, VIP A" error={err('sector')} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}><Field label="Ряд" value={row} onChangeText={setRow} placeholder="—" /></View>
          <View style={{ flex: 1 }}><Field label="Места" value={seats} onChangeText={setSeats} placeholder="12–13" /></View>
        </View>
        <Text style={st.label}>Количество билетов</Text>
        <View style={st.qtyRow}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Pressable key={n} onPress={() => setQty(n)} style={[st.qtyBox, qty === n && st.qtyActive]}>
              <Text style={[st.qtyText, qty === n && { color: colors.accentText }]}>{n}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={st.label}>Тип билета</Text>
        <View style={{ flexDirection: 'row', marginBottom: space(4) }}>
          <Chip label="Электронный" icon="qr-code-outline" active={ticketType === 'electronic'} onPress={() => setTicketType('electronic')} />
          <Chip label="Бумажный" icon="document-outline" active={ticketType === 'paper'} onPress={() => setTicketType('paper')} />
        </View>

        {/* 3. Цена */}
        <Step n={3} title="Цена" />
        <Field label="Номинал (цена на билете), сум *" keyboardType="number-pad" value={pretty(nominal)} onChangeText={setNominal} placeholder="400 000" error={err('nominal')} />
        <Field
          label="Ваша цена за 1 билет, сум *"
          keyboardType="number-pad"
          value={pretty(price)}
          onChangeText={setPrice}
          placeholder="500 000"
          error={err('price') || (nominalN && priceN > maxPrice ? errors.price : '')}
          hint={nominalN ? `Не выше ${formatPrice(maxPrice)} (+${MAX_MARKUP * 100}% к номиналу)` : undefined}
        />
        {nominalN > 0 && (
          <View style={st.quick}>
            {[0, 0.1, 0.2, 0.3].map((p) => (
              <Chip key={p} label={p === 0 ? 'По номиналу' : `+${p * 100}%`} active={priceN === Math.round(nominalN * (1 + p))} onPress={() => setPrice(String(Math.round(nominalN * (1 + p))))} />
            ))}
          </View>
        )}
        {priceN > 0 && (
          <View style={st.earn}>
            <Text style={st.earnLabel}>Вы получите</Text>
            <Text style={st.earnValue}>{formatPrice(priceN * qty)}</Text>
            <Text style={st.earnHint}>Комиссию сервиса платит покупатель. Выплата на карту после передачи билета.</Text>
          </View>
        )}

        {/* 4. Подтверждение */}
        <Step n={4} title="Подтверждение билета" />
        <Pressable onPress={pickProof} style={[st.upload, !!err('proof') && { borderColor: colors.red }]}>
          {proof && proof !== 'existing' ? (
            <Image source={{ uri: proof }} style={st.proofImg} />
          ) : proof === 'existing' ? (
            <><Ionicons name="checkmark-circle" size={28} color={colors.green} /><Text style={st.uploadText}>Билет уже проверен</Text></>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={28} color={colors.accent} />
              <Text style={st.uploadText}>Загрузить фото / скрин билета</Text>
              <Text style={st.hint}>Видит только модератор. QR-код можно закрыть.</Text>
            </>
          )}
        </Pressable>
        {!!err('proof') && <Text style={st.error}>{err('proof')}</Text>}

        <Field label="Комментарий" value={comment} onChangeText={setComment} placeholder="Почему продаёте, как передадите билет" multiline style={[st.textarea]} />

        <Pressable onPress={() => setAgree((v) => !v)} style={st.agree}>
          <Ionicons name={agree ? 'checkbox' : 'square-outline'} size={22} color={agree ? colors.accent : err('agree') ? colors.red : colors.textDim} />
          <Text style={st.agreeText}>Билет настоящий, принадлежит мне и не будет продан повторно. Согласен с правилами безопасной сделки.</Text>
        </Pressable>
      </ScrollView>

      <View style={[st.bottom, { paddingBottom: insets.bottom + space(3) }]}>
        <Button title={editing ? 'Сохранить изменения' : 'Опубликовать объявление'} icon={editing ? 'save-outline' : 'megaphone-outline'} onPress={submit} />
      </View>
    </View>
  );
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <View style={st.step}>
      <View style={st.stepN}><Text style={st.stepNText}>{n}</Text></View>
      <Text style={st.stepTitle}>{title}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  h1: { color: colors.text, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  step: { flexDirection: 'row', alignItems: 'center', marginTop: space(4), marginBottom: space(3) },
  stepN: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  stepNText: { color: colors.accentText, fontWeight: '900', fontSize: 13 },
  stepTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginLeft: 10 },
  selected: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1.5, padding: space(3) },
  selThumb: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  selTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  selMeta: { color: colors.textDim, fontSize: 12, marginTop: 3 },
  change: { color: colors.accent, fontWeight: '700', fontSize: 13, marginLeft: 8 },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, marginLeft: 8, height: '100%' },
  pickRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  pickTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  hint: { color: colors.textMuted, fontSize: 12, marginTop: 6, textAlign: 'center' },
  error: { color: colors.red, fontSize: 12, marginTop: 6 },
  label: { color: colors.textDim, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', gap: 8, marginBottom: space(4) },
  qtyBox: { flex: 1, height: 46, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  qtyActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  qtyText: { color: colors.text, fontSize: 16, fontWeight: '800' },
  quick: { flexDirection: 'row', flexWrap: 'wrap', marginTop: -space(2), marginBottom: space(3) },
  earn: { backgroundColor: '#12291F', borderColor: '#1E4634', borderWidth: 1, borderRadius: radius.lg, padding: space(4) },
  earnLabel: { color: colors.textDim, fontSize: 13 },
  earnValue: { color: colors.green, fontSize: 24, fontWeight: '900', marginTop: 2 },
  earnHint: { color: colors.textDim, fontSize: 12, marginTop: 6, lineHeight: 17 },
  upload: { height: 150, borderRadius: radius.lg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: space(4), overflow: 'hidden' },
  uploadText: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 8 },
  proofImg: { width: '100%', height: '100%' },
  textarea: { height: 96, paddingTop: 12, textAlignVertical: 'top' },
  agree: { flexDirection: 'row', alignItems: 'flex-start' },
  agreeText: { color: colors.textDim, fontSize: 13, lineHeight: 19, marginLeft: 10, flex: 1 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space(4), backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
});
