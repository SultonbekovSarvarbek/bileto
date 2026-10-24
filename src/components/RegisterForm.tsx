import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, normalizePhone, radius, space } from '../theme';
import { Role, useStore } from '../store';
import { Button, Field } from './ui';

// Регистрация: имя, телефон и роль. Используется на экране входа и перед продажей билета.
export function RegisterForm({ defaultRole, onDone }: { defaultRole: Role; onDone?: () => void }) {
  const { login, t } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [role, setRole] = useState<Role>(defaultRole);
  const normalized = normalizePhone(phone);

  const roles: { id: Role; title: string; hint: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'buyer', title: t.register.buyer, hint: t.register.buyerHint, icon: 'bag-handle-outline' },
    { id: 'seller', title: t.register.seller, hint: t.register.sellerHint, icon: 'pricetags-outline' },
  ];

  return (
    <View>
      <Text style={st.title}>{t.register.title}</Text>
      <Text style={st.sub}>{t.register.sub}</Text>
      <Field label={t.register.name} value={name} onChangeText={setName} placeholder={t.register.namePh} autoComplete="name" />
      <Field label={t.register.phone} keyboardType="phone-pad" value={phone} onChangeText={setPhone} autoComplete="tel" />
      <Text style={st.label}>{t.register.role}</Text>
      <View style={st.roles}>
        {roles.map((r) => (
          <Pressable key={r.id} onPress={() => setRole(r.id)} style={[st.role, role === r.id && st.roleActive]}>
            <Ionicons name={r.icon} size={22} color={role === r.id ? colors.accent : colors.textDim} />
            <Text style={st.roleTitle}>{r.title}</Text>
            <Text style={st.roleHint}>{r.hint}</Text>
          </Pressable>
        ))}
      </View>
      <Button
        title={t.register.submit}
        disabled={name.trim().length < 2 || !normalized}
        onPress={() => {
          if (!normalized) return;
          login(name.trim(), normalized, role);
          onDone?.();
        }}
      />
    </View>
  );
}

const st = StyleSheet.create({
  title: { color: colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  sub: { color: colors.textDim, fontSize: 14, textAlign: 'center', marginTop: 4, marginBottom: space(6) },
  label: { color: colors.textDim, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  roles: { flexDirection: 'row', gap: 12, marginBottom: space(6) },
  role: { flex: 1, padding: space(4), borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  roleActive: { borderColor: colors.accent, backgroundColor: '#2A2410' },
  roleTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 8 },
  roleHint: { color: colors.textDim, fontSize: 12, marginTop: 2 },
});
