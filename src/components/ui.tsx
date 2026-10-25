import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, space } from '../theme';

export function Button({
  title, onPress, variant = 'primary', icon, disabled, loading, style,
}: {
  title: string; onPress?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap; disabled?: boolean; loading?: boolean; style?: ViewStyle;
}) {
  const bg = { primary: colors.accent, secondary: colors.surface2, ghost: 'transparent', danger: '#3A1C1F' }[variant];
  const fg = { primary: colors.accentText, secondary: colors.text, ghost: colors.text, danger: colors.red }[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [s.btn, { backgroundColor: bg, opacity: disabled ? 0.4 : pressed || loading ? 0.8 : 1 }, variant === 'ghost' && { borderWidth: 1, borderColor: colors.border }, style]}
    >
      {loading ? (
        <ActivityIndicator color={fg} style={title ? { marginRight: 8 } : undefined} />
      ) : (
        icon && <Ionicons name={icon} size={title ? 18 : 22} color={fg} style={title ? { marginRight: 8 } : undefined} />
      )}
      {!!title && <Text style={[s.btnText, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

export function Chip({ label, active, onPress, icon, color }: { label: string; active?: boolean; onPress?: () => void; icon?: keyof typeof Ionicons.glyphMap; color?: string }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && { backgroundColor: colors.text, borderColor: colors.text }]}>
      {icon && <Ionicons name={icon} size={14} color={active ? colors.bg : color ?? colors.textDim} style={{ marginRight: 6 }} />}
      <Text style={[s.chipText, active && { color: colors.bg }]}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionTitle}>{title}</Text>
      {action && (
        <Pressable onPress={onAction}>
          <Text style={s.sectionAction}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function Field({ label, hint, error, style, ...props }: TextInputProps & { label: string; hint?: string; error?: string }) {
  return (
    <View style={{ marginBottom: space(4) }}>
      <Text style={s.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.textMuted} style={[s.input, style, error && { borderColor: colors.red }]} {...props} />
      {error ? <Text style={[s.hint, { color: colors.red }]}>{error}</Text> : hint ? <Text style={s.hint}>{hint}</Text> : null}
    </View>
  );
}

export function Badge({ text, color = colors.accent, textColor }: { text: string; color?: string; textColor?: string }) {
  return (
    <View style={[s.badge, { backgroundColor: color + '22' }]}>
      <Text style={[s.badgeText, { color: textColor ?? color }]}>{text}</Text>
    </View>
  );
}

export function Empty({ icon, title, text, children }: { icon: keyof typeof Ionicons.glyphMap; title: string; text?: string; children?: React.ReactNode }) {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}><Ionicons name={icon} size={28} color={colors.textDim} /></View>
      <Text style={s.emptyTitle}>{title}</Text>
      {text && <Text style={s.emptyText}>{text}</Text>}
      {children}
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export const s = StyleSheet.create({
  btn: { height: 52, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: space(5) },
  btnText: { fontSize: 16, fontWeight: '700' },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, marginRight: 8 },
  chipText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space(6), marginBottom: space(3), paddingHorizontal: space(4) },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  sectionAction: { color: colors.accent, fontSize: 14, fontWeight: '600' },
  label: { color: colors.textDim, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, height: 50, paddingHorizontal: 14, color: colors.text, fontSize: 16 },
  hint: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.4 },
  empty: { alignItems: 'center', padding: space(10) },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', marginBottom: space(4) },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  emptyText: { color: colors.textDim, fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: space(4) },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: space(4) },
});
