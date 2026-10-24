import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, formatPrice, radius, space } from '../theme';
import { Delivery, SELLER_COMMISSION, SERVICE_FEE } from '../data';
import { useStore } from '../store';
import { Button, Chip, Field } from '../components/ui';
import { RegisterForm } from '../components/RegisterForm';
import { ConsentText } from '../components/ConsentText';
import { notify } from './ListingScreen';
import type { ScreenProps } from '../navigation';

const onlyDigits = (s: string) => s.replace(/\D/g, '');
const num = (s: string) => Number(onlyDigits(s) || 0);
const pretty = (s: string) => (onlyDigits(s) ? Number(onlyDigits(s)).toLocaleString('ru-RU').replace(/,/g, ' ') : '');

export default function SellScreen({ route, navigation }: ScreenProps<'Sell'>) {
  const insets = useSafeAreaInsets();
  const { getEvent, listingView, addListing, updateListing, listings, user, t, setRole } = useStore();
  const editing = route.params?.editId ? listings.find((l) => l.id === route.params!.editId) : undefined;

  // Со страницы события объявление привязывается к нему, а название подставляется.
  const eventId = editing ? editing.eventId : route.params?.eventId;
  const [title, setTitle] = useState(editing ? listingView(editing).title : (eventId && getEvent(eventId)?.title) || '');
  const [sector, setSector] = useState(editing?.sector ?? '');
  const [row, setRow] = useState(editing?.row ?? '');
  const [seats, setSeats] = useState(editing?.seats ?? '');
  const [qty, setQty] = useState(editing?.qty ?? 1);
  const [delivery, setDelivery] = useState<Delivery>(editing?.delivery ?? 'delivery');
  const [price, setPrice] = useState(editing ? String(editing.price) : '');
  const [proof, setProof] = useState<string | null>(editing ? 'existing' : null);
  const [agree, setAgree] = useState(!!editing);
  const [tried, setTried] = useState(false);

  // Продать билет можно только после регистрации и только в роли продавца.
  if (!user) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space(6) }} keyboardShouldPersistTaps="handled">
        <RegisterForm defaultRole="seller" />
      </ScrollView>
    );
  }
  if (user.role !== 'seller') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, padding: space(6), justifyContent: 'center' }}>
        <Text style={st.h1}>{t.sell.sellerOnly}</Text>
        <Text style={st.gateText}>{t.sell.sellerOnlyText}</Text>
        <Button title={t.sell.becomeSeller} icon="pricetags-outline" onPress={() => setRole('seller')} style={{ marginTop: space(6) }} />
      </View>
    );
  }

  const priceN = num(price);
  const commission = Math.round(priceN * qty * SELLER_COMMISSION);
  const buyerFee = Math.round(priceN * qty * SERVICE_FEE);
  const errors = {
    title: !title.trim() ? t.sell.errTitle : '',
    proof: !proof ? t.sell.errProof : '',
    sector: !sector.trim() ? t.sell.errSector : '',
    price: !priceN ? t.sell.errPrice : '',
    agree: !agree ? t.sell.errAgree : '',
  };
  const valid = Object.values(errors).every((e) => !e);

  const pickProof = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!res.canceled) setProof(res.assets[0].uri);
  };

  const submit = () => {
    setTried(true);
    if (!valid) {
      notify(t.sell.checkForm, Object.values(errors).filter(Boolean)[0]);
      return;
    }
    const payload = { eventId, title: title.trim(), sector: sector.trim(), row: row.trim() || undefined, seats: seats.trim() || undefined, qty, price: priceN, delivery };
    if (editing) {
      updateListing(editing.id, payload);
      navigation.goBack();
    } else {
      const created = addListing(payload);
      navigation.replace('Done', { id: created.id });
    }
  };

  const err = (k: keyof typeof errors) => (tried ? errors[k] : '');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: space(4), paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        {/* 1. Название */}
        <Step n={1} title={t.sell.stepTitle} />
        <Field label={t.sell.title} value={title} onChangeText={setTitle} placeholder={t.sell.titlePh} error={err('title')} />

        {/* 2. Фото */}
        <Step n={2} title={t.sell.stepPhoto} />
        <Pressable onPress={pickProof} style={[st.upload, !!err('proof') && { borderColor: colors.red }]}>
          {proof && proof !== 'existing' ? (
            <Image source={{ uri: proof }} style={st.proofImg} />
          ) : proof === 'existing' ? (
            <><Ionicons name="checkmark-circle" size={28} color={colors.green} /><Text style={st.uploadText}>{t.sell.proofDone}</Text></>
          ) : (
            <>
              <Ionicons name="camera-outline" size={28} color={colors.accent} />
              <Text style={st.uploadText}>{t.sell.upload}</Text>
              <Text style={st.hint}>{t.sell.uploadHint}</Text>
            </>
          )}
        </Pressable>
        {!!err('proof') && <Text style={[st.error, { marginTop: -space(2), marginBottom: space(2) }]}>{err('proof')}</Text>}

        {/* 3. Место */}
        <Step n={3} title={t.sell.stepSeat} />
        <Field label={t.sell.sector} value={sector} onChangeText={setSector} placeholder={t.sell.sectorPh} error={err('sector')} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}><Field label={t.listing.row} value={row} onChangeText={setRow} placeholder="—" /></View>
          <View style={{ flex: 1 }}><Field label={t.listing.seats} value={seats} onChangeText={setSeats} placeholder="12–13" /></View>
        </View>
        <Text style={st.label}>{t.sell.qty}</Text>
        <View style={st.qtyRow}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Pressable key={n} onPress={() => setQty(n)} style={[st.qtyBox, qty === n && st.qtyActive]}>
              <Text style={[st.qtyText, qty === n && { color: colors.accentText }]}>{n}</Text>
            </Pressable>
          ))}
        </View>

        {/* 4. Цена и передача */}
        <Step n={4} title={t.sell.stepPrice} />
        <Field label={t.sell.price} keyboardType="number-pad" value={pretty(price)} onChangeText={setPrice} placeholder="500 000" error={err('price')} />
        <Text style={st.label}>{t.sell.transfer}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Chip label={t.common.delivery} icon="bicycle-outline" active={delivery === 'delivery'} onPress={() => setDelivery('delivery')} />
          <Chip label={t.common.pickup} icon="walk-outline" active={delivery === 'pickup'} onPress={() => setDelivery('pickup')} />
        </View>
        <Text style={[st.hint, { textAlign: 'left', marginBottom: space(4) }]}>{delivery === 'delivery' ? t.sell.deliveryHint : t.sell.pickupHint}</Text>
        <View style={[st.earn, { marginBottom: space(4) }]}>
          {priceN > 0 && (
            <>
              <Text style={st.earnLabel}>{t.sell.youGet}</Text>
              <Text style={st.earnValue}>{formatPrice(priceN * qty - commission)}</Text>
            </>
          )}
          <Text style={[st.earnHint, !priceN && { marginTop: 0 }]}>
            {t.sell.commissionNote(Math.round(SELLER_COMMISSION * 100), Math.round(SERVICE_FEE * 100))}
          </Text>
          {priceN > 0 && <Text style={st.earnHint}>{t.sell.commissionCalc(formatPrice(commission), formatPrice(buyerFee))}</Text>}
        </View>

        <Pressable onPress={() => setAgree((v) => !v)} style={st.agree}>
          <Ionicons name={agree ? 'checkbox' : 'square-outline'} size={22} color={agree ? colors.accent : err('agree') ? colors.red : colors.textDim} />
          <ConsentText template={t.sell.agree} style={st.agreeText} />
        </Pressable>
      </ScrollView>

      <View style={[st.bottom, { paddingBottom: insets.bottom + space(3) }]}>
        <Button title={editing ? t.sell.save : t.sell.publish} icon={editing ? 'save-outline' : 'megaphone-outline'} onPress={submit} />
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
  gateText: { color: colors.textDim, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: space(3) },
  h1: { color: colors.text, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  step: { flexDirection: 'row', alignItems: 'center', marginTop: space(4), marginBottom: space(3) },
  stepN: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  stepNText: { color: colors.accentText, fontWeight: '900', fontSize: 13 },
  stepTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginLeft: 10 },
  hint: { color: colors.textMuted, fontSize: 12, marginTop: 6, textAlign: 'center' },
  error: { color: colors.red, fontSize: 12, marginTop: 6 },
  label: { color: colors.textDim, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', gap: 8, marginBottom: space(4) },
  qtyBox: { flex: 1, height: 46, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  qtyActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  qtyText: { color: colors.text, fontSize: 16, fontWeight: '800' },
  earn: { backgroundColor: '#12291F', borderColor: '#1E4634', borderWidth: 1, borderRadius: radius.lg, padding: space(4) },
  earnLabel: { color: colors.textDim, fontSize: 13 },
  earnValue: { color: colors.green, fontSize: 24, fontWeight: '900', marginTop: 2 },
  earnHint: { color: colors.textDim, fontSize: 12, marginTop: 6, lineHeight: 17 },
  upload: { height: 150, borderRadius: radius.lg, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: space(4), overflow: 'hidden' },
  uploadText: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 8 },
  proofImg: { width: '100%', height: '100%' },
  agree: { flexDirection: 'row', alignItems: 'flex-start' },
  agreeText: { color: colors.textDim, fontSize: 13, lineHeight: 19, marginLeft: 10, flex: 1 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space(4), backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
});
