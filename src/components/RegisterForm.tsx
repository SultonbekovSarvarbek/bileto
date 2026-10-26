import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, normalizePhone, radius, space } from '../theme';
import { errorText, Role, useStore } from '../store';
import { Button, Field } from './ui';
import { ConsentText } from './ConsentText';

// Регистрация (имя, телефон, пароль, роль) и вход (телефон, пароль). Используется на экране входа и перед продажей билета.
export function RegisterForm({ defaultRole, onDone }: { defaultRole: Role; onDone?: () => void }) {
  const { register, login, t } = useStore();
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(defaultRole);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const normalized = normalizePhone(phone);
  const isLogin = mode === 'login';
  const valid = !!normalized && (isLogin ? password.length > 0 : name.trim().length >= 2 && password.length >= 6);

  const roles: { id: Role; title: string; hint: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'buyer', title: t.register.buyer, hint: t.register.buyerHint, icon: 'bag-handle-outline' },
    { id: 'seller', title: t.register.seller, hint: t.register.sellerHint, icon: 'pricetags-outline' },
  ];

  return (
    <View>
      <Text style={st.title}>{isLogin ? t.register.loginTitle : t.register.title}</Text>
      <Text style={st.sub}>{isLogin ? t.register.loginSub : t.register.sub}</Text>
      {!isLogin && <Field label={t.register.name} value={name} onChangeText={setName} placeholder={t.register.namePh} autoComplete="name" />}
      <Field label={t.register.phone} keyboardType="phone-pad" value={phone} onChangeText={setPhone} autoComplete="tel" />
      <Field
        label={t.register.password}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete={isLogin ? 'current-password' : 'new-password'}
        textContentType={isLogin ? 'password' : 'newPassword'}
        hint={isLogin ? undefined : t.register.passwordHint}
      />
      {!isLogin && (
        <>
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
        </>
      )}
      <Button
        title={isLogin ? t.register.loginSubmit : t.register.submit}
        disabled={!valid}
        loading={busy}
        onPress={async () => {
          if (!normalized) return;
          setBusy(true);
          setError('');
          try {
            if (isLogin) await login(normalized, password);
            else await register(name.trim(), normalized, password, role);
            onDone?.();
          } catch (e) {
            setError(errorText(e, t));
          } finally {
            setBusy(false);
          }
        }}
      />
      {!!error && <Text style={st.error}>{error}</Text>}
      <Pressable
        onPress={() => {
          setMode(isLogin ? 'register' : 'login');
          setError('');
        }}
        style={st.switch}
      >
        <Text style={st.switchText}>{isLogin ? t.register.toRegister : t.register.toLogin}</Text>
      </Pressable>
      <ConsentText template={t.legal.consent} style={{ textAlign: 'center', marginTop: space(4) }} />
    </View>
  );
}

const st = StyleSheet.create({
  title: { color: colors.text, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  error: { color: colors.red, fontSize: 13, textAlign: 'center', marginTop: space(3) },
  switch: { alignSelf: 'center', paddingVertical: space(3), marginTop: space(2) },
  switchText: { color: colors.accent, fontSize: 15, fontWeight: '700' },
  sub: { color: colors.textDim, fontSize: 14, textAlign: 'center', marginTop: 4, marginBottom: space(6) },
  label: { color: colors.textDim, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  roles: { flexDirection: 'row', gap: 12, marginBottom: space(6) },
  role: { flex: 1, padding: space(4), borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  roleActive: { borderColor: colors.accent, backgroundColor: '#2A2410' },
  roleTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 8 },
  roleHint: { color: colors.textDim, fontSize: 12, marginTop: 2 },
});
