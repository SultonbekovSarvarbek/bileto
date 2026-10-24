import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { colors, space } from '../theme';

// Минимальный рендер юридических текстов: # / ## заголовки, "- " списки, абзацы, **жирный**.
function Inline({ text, style }: { text: string; style: StyleProp<TextStyle> }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <Text style={style}>
      {parts.map((p, i) =>
        p.startsWith('**') ? <Text key={i} style={st.bold}>{p.slice(2, -2)}</Text> : p,
      )}
    </Text>
  );
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.split(/\n\s*\n/);
  return (
    <View>
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        if (lines[0].startsWith('# ')) return <Inline key={i} text={lines[0].slice(2)} style={st.h1} />;
        if (lines[0].startsWith('## ')) return <Inline key={i} text={lines[0].slice(3)} style={st.h2} />;
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <View key={i} style={st.list}>
              {lines.map((l, j) => (
                <View key={j} style={st.item}>
                  <Text style={st.dot}>•</Text>
                  <Inline text={l.slice(2)} style={[st.p, { flex: 1, marginBottom: 0 }]} />
                </View>
              ))}
            </View>
          );
        }
        return <Inline key={i} text={lines.join('\n')} style={st.p} />;
      })}
    </View>
  );
}

const st = StyleSheet.create({
  h1: { color: colors.text, fontSize: 24, fontWeight: '900', marginBottom: space(4) },
  h2: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: space(4), marginBottom: space(2) },
  p: { color: colors.textDim, fontSize: 15, lineHeight: 22, marginBottom: space(3) },
  bold: { color: colors.text, fontWeight: '700' },
  list: { marginBottom: space(3) },
  item: { flexDirection: 'row', marginBottom: 6 },
  dot: { color: colors.accent, fontSize: 15, lineHeight: 22, width: 16 },
});
