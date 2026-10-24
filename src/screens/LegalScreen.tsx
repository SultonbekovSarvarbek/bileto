import React, { useLayoutEffect } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '../theme';
import { useStore } from '../store';
import { LEGAL } from '../legal/docs';
import { Markdown } from '../components/Markdown';
import type { ScreenProps } from '../navigation';

// Пользовательское соглашение / Политика конфиденциальности на текущем языке.
export default function LegalScreen({ route, navigation }: ScreenProps<'Legal'>) {
  const insets = useSafeAreaInsets();
  const { lang, t } = useStore();
  const { doc } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: doc === 'terms' ? t.legal.terms : t.legal.privacy });
  }, [navigation, doc, t]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space(4), paddingBottom: insets.bottom + space(8) }}>
      <Markdown source={LEGAL[lang][doc]} />
    </ScrollView>
  );
}
