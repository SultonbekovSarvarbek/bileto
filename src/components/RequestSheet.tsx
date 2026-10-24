import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, formatPhone, formatPrice, normalizePhone, radius, space } from '../theme';
import { Listing, SERVICE_FEE } from '../data';
import { useStore } from '../store';
import { Button, Field } from './ui';

// Окно «Купить»: имя + телефон → заявка уходит операторам → «Заявка отправлена».
export function RequestSheet({ listing, visible, onClose }: { listing: Listing; visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { user, sendRequest, listingView, t } = useStore();
  const [qty, setQty] = useState(1);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user ? formatPhone(user.phone) : '+998 ');
  const [tried, setTried] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const subtotal = listing.price * qty;
  const fee = Math.round(subtotal * SERVICE_FEE);
  const normalized = normalizePhone(phone);
  const errName = name.trim().length < 2 ? t.request.errName : '';
  const errPhone = !normalized ? t.request.errPhone : '';

  const submit = () => {
    setTried(true);
    if (errName || !normalized) return;
    sendRequest({ listingId: listing.id, qty, subtotal, fee, total: subtotal + fee, name: name.trim(), phone: normalized });
    setSentTo(normalized);
  };

  const close = () => {
    onClose();
    setSentTo(null);
    setTried(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={st.backdrop} onPress={close} />
        <View style={[st.sheet, { paddingBottom: insets.bottom + space(4) }]}>
          {sentTo ? (
            <View style={{ alignItems: 'center' }}>
              <View style={st.doneIcon}><Ionicons name="checkmark" size={36} color={colors.accentText} /></View>
              <Text style={st.doneTitle}>{t.request.sentTitle}</Text>
              <Text style={st.doneText}>{t.request.sentText(formatPhone(sentTo))}</Text>
              <Button style={{ alignSelf: 'stretch', marginTop: space(5) }} title={t.request.ok} onPress={close} />
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
              <View style={st.headRow}>
                <Text style={st.title}>{t.request.title}</Text>
                <Pressable onPress={close} hitSlop={10}><Ionicons name="close" size={24} color={colors.textDim} /></Pressable>
              </View>
              <Text style={st.listing} numberOfLines={2}>{listingView(listing).title} · {listing.sector}</Text>

              {listing.qty > 1 && (
                <View style={st.qtyRow}>
                  {Array.from({ length: listing.qty }, (_, i) => i + 1).map((n) => (
                    <Pressable key={n} onPress={() => setQty(n)} style={[st.qtyBox, qty === n && st.qtyActive]}>
                      <Text style={[st.qtyText, qty === n && { color: colors.accentText }]}>{n}</Text>
                    </Pressable>
                  ))}
                </View>
              )}

              <Field label={t.request.name} value={name} onChangeText={setName} placeholder={t.request.namePh} autoComplete="name" error={tried ? errName : ''} />
              <Field label={t.request.phone} value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" error={tried ? errPhone : ''} />

              <View style={st.sum}>
                <Line label={t.request.tickets(qty)} value={formatPrice(subtotal)} />
                <Line label={t.request.fee(Math.round(SERVICE_FEE * 100))} value={formatPrice(fee)} />
                <View style={st.divider} />
                <Line label={t.request.total} value={formatPrice(subtotal + fee)} bold />
                <Text style={st.note}>{t.request.payNote}</Text>
              </View>

              <Button title={t.request.submit} icon="paper-plane" onPress={submit} />
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
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

const st = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#000a' },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: space(5), maxHeight: '90%' },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 22, fontWeight: '900' },
  listing: { color: colors.textDim, fontSize: 14, marginTop: 4, marginBottom: space(4) },
  qtyRow: { flexDirection: 'row', gap: 8, marginBottom: space(4) },
  qtyBox: { flex: 1, height: 44, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  qtyActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  qtyText: { color: colors.text, fontSize: 16, fontWeight: '800' },
  sum: { backgroundColor: colors.bg, borderRadius: radius.lg, padding: space(4), marginBottom: space(4) },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  lineLabel: { color: colors.textDim, fontSize: 14 },
  lineValue: { color: colors.text, fontSize: 15, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: space(2) },
  note: { color: colors.textMuted, fontSize: 12, marginTop: space(2), lineHeight: 17 },
  doneIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: space(2) },
  doneTitle: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: space(4), textAlign: 'center' },
  doneText: { color: colors.textDim, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: space(2) },
});
