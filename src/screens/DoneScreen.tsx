import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, space } from '../theme';
import { useStore } from '../store';
import { Button } from '../components/ui';
import type { ScreenProps } from '../navigation';

export default function DoneScreen({ route, navigation }: ScreenProps<'Done'>) {
  const { listings, listingView, t } = useStore();
  const listing = listings.find((l) => l.id === route.params.id);
  const title = listing ? listingView(listing).title : '';
  return (
    <View style={st.done}>
      <View style={st.doneIcon}><Ionicons name="megaphone" size={44} color={colors.accentText} /></View>
      <Text style={st.doneTitle}>{t.done.listed}</Text>
      <Text style={st.doneText}>{t.done.listedText(title)}</Text>
      <Button
        style={{ alignSelf: 'stretch', marginTop: space(6) }}
        title={t.headers.myListings}
        onPress={() => navigation.reset({ index: 1, routes: [{ name: 'Tabs' }, { name: 'MyListings' }] })}
      />
      <Button style={{ alignSelf: 'stretch', marginTop: space(3) }} title={t.done.home} variant="ghost" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] })} />
    </View>
  );
}

const st = StyleSheet.create({
  done: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space(6), backgroundColor: colors.bg },
  doneIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  doneTitle: { color: colors.text, fontSize: 26, fontWeight: '900', marginTop: space(5), textAlign: 'center' },
  doneText: { color: colors.textDim, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: space(3) },
});
