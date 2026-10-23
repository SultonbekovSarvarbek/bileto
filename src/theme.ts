export const colors = {
  bg: '#0E0F13',
  surface: '#17191F',
  surface2: '#20232B',
  border: '#2A2E38',
  text: '#F4F5F7',
  textDim: '#9AA0AD',
  textMuted: '#646B7A',
  accent: '#FFC83D',
  accentText: '#1A1400',
  green: '#3DDC97',
  red: '#FF5D5D',
  blue: '#5B8CFF',
};

export const radius = { sm: 8, md: 14, lg: 20, xl: 28 };
export const space = (n: number) => n * 4;

export const formatPrice = (n: number) =>
  n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' сум';

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${WEEKDAYS[d.getDay()]} · ${hh}:${mm}`;
};

export const formatShortDate = (iso: string) => {
  const d = new Date(iso);
  return { day: String(d.getDate()), month: MONTHS[d.getMonth()] };
};
