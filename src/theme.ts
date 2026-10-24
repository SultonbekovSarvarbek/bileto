import { tr } from './i18n';

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
  n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' ' + tr().currency;

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const { months, weekdays } = tr();
  return `${d.getDate()} ${months[d.getMonth()]}, ${weekdays[d.getDay()]} · ${hh}:${mm}`;
};

// "+998 90 123-45-67" / "901234567" → "+998901234567"; null, если номер неполный.
export const normalizePhone = (input: string) => {
  const digits = input.replace(/\D/g, '');
  const full = digits.length === 9 ? '998' + digits : digits;
  return /^998\d{9}$/.test(full) ? '+' + full : null;
};

// "+998901234567" → "+998 90 123-45-67"
export const formatPhone = (p: string) => `${p.slice(0, 4)} ${p.slice(4, 6)} ${p.slice(6, 9)}-${p.slice(9, 11)}-${p.slice(11)}`;

// Номер продавца покупателю виден только размытым: связь — через оператора.
export const maskPhone = (p: string) => `${p.slice(0, 4)} ${p.slice(4, 6)} ••• •• ${p.slice(-2)}`;
