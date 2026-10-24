import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { useStore } from '../store';
import type { RootStackParamList } from '../navigation';

type Doc = 'terms' | 'privacy';

// Текст со ссылками на документы: {terms} и {privacy} в шаблоне становятся ссылками.
export function ConsentText({ template, style, onOpen }: { template: string; style?: StyleProp<TextStyle>; onOpen?: (doc: Doc) => void }) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useStore();
  const open = onOpen ?? ((doc: Doc) => nav.navigate('Legal', { doc }));
  const links: Record<Doc, string> = { terms: t.legal.termsLink, privacy: t.legal.privacyLink };
  return (
    <Text style={[st.text, style]}>
      {template.split(/(\{terms\}|\{privacy\})/g).map((part, i) => {
        const doc = part === '{terms}' ? 'terms' : part === '{privacy}' ? 'privacy' : null;
        return doc ? (
          <Text key={i} style={st.link} onPress={() => open(doc)}>{links[doc]}</Text>
        ) : (
          part
        );
      })}
    </Text>
  );
}

const st = StyleSheet.create({
  text: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  link: { color: colors.accent, textDecorationLine: 'underline' },
});
