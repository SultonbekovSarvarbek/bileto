// Справочники и демо-данные. Категории повторяют разделы афиши iTicket.uz
// (концерты, театр, спорт, выставки, детям и т.д.). Позже заменяются API.

export type CategoryId =
  | 'concerts'
  | 'theatre'
  | 'sport'
  | 'standup'
  | 'kids'
  | 'festivals'
  | 'exhibitions'
  | 'cinema';

export type Category = { id: CategoryId; title: string; icon: string; color: string };

export const CATEGORIES: Category[] = [
  { id: 'concerts', title: 'Концерты', icon: 'musical-notes', color: '#FF6B6B' },
  { id: 'theatre', title: 'Театр', icon: 'color-palette', color: '#B07CFF' },
  { id: 'sport', title: 'Спорт', icon: 'football', color: '#3DDC97' },
  { id: 'standup', title: 'Стендап', icon: 'mic', color: '#FFC83D' },
  { id: 'kids', title: 'Детям', icon: 'balloon', color: '#5BC8FF' },
  { id: 'festivals', title: 'Фестивали', icon: 'sparkles', color: '#FF8FCF' },
  { id: 'exhibitions', title: 'Выставки', icon: 'images', color: '#8FA3FF' },
  { id: 'cinema', title: 'Кино', icon: 'film', color: '#FF9F45' },
];

export const CITIES = ['Ташкент', 'Самарканд', 'Бухара', 'Наманган', 'Андижан', 'Фергана', 'Нукус'];

export type Venue = { id: string; name: string; city: string };

export const VENUES: Venue[] = [
  { id: 'humo', name: 'Humo Arena', city: 'Ташкент' },
  { id: 'friendship', name: 'Дворец дружбы народов', city: 'Ташкент' },
  { id: 'panorama', name: 'Кинотеатр Panorama', city: 'Ташкент' },
  { id: 'navoi', name: 'ГАБТ им. Алишера Навои', city: 'Ташкент' },
  { id: 'forums', name: 'Дворец международных форумов', city: 'Ташкент' },
  { id: 'turkiston', name: 'Дворец искусств «Туркистон»', city: 'Ташкент' },
  { id: 'milliy', name: 'Стадион «Миллий»', city: 'Ташкент' },
  { id: 'registan', name: 'Площадь Регистан', city: 'Самарканд' },
];

export type Event = {
  id: string;
  title: string;
  category: CategoryId;
  venueId: string;
  date: string; // ISO
  officialMin: number;
  officialMax: number;
  soldOut: boolean;
  color: string;
  emoji: string;
  description: string;
};

const d = (s: string) => new Date(s).toISOString();

export const EVENTS: Event[] = [
  {
    id: 'e1', title: 'Большой осенний концерт звёзд эстрады', category: 'concerts', venueId: 'humo',
    date: d('2026-11-07T20:00:00'), officialMin: 200000, officialMax: 1450000, soldOut: true,
    color: '#FF6B6B', emoji: '🎤', description: 'Главный поп-концерт сезона. Все билеты на официальной кассе раскуплены за неделю.',
  },
  {
    id: 'e2', title: 'Симфонический вечер: саундтреки кино', category: 'concerts', venueId: 'panorama',
    date: d('2026-11-14T19:00:00'), officialMin: 170000, officialMax: 800000, soldOut: true,
    color: '#7C9CFF', emoji: '🎻', description: 'Более 30 музыкантов исполняют музыку из популярных фильмов и сериалов.',
  },
  {
    id: 'e3', title: 'Пахтакор — Насаф. Суперлига', category: 'sport', venueId: 'milliy',
    date: d('2026-11-02T18:00:00'), officialMin: 30000, officialMax: 150000, soldOut: false,
    color: '#3DDC97', emoji: '⚽', description: 'Центральный матч тура Суперлиги Узбекистана.',
  },
  {
    id: 'e4', title: 'Лебединое озеро', category: 'theatre', venueId: 'navoi',
    date: d('2026-11-21T18:30:00'), officialMin: 100000, officialMax: 450000, soldOut: true,
    color: '#B07CFF', emoji: '🩰', description: 'Классический балет П. И. Чайковского в двух действиях.',
  },
  {
    id: 'e5', title: 'Стендап-шоу «Без тормозов»', category: 'standup', venueId: 'turkiston',
    date: d('2026-11-09T19:30:00'), officialMin: 150000, officialMax: 600000, soldOut: true,
    color: '#FFC83D', emoji: '😂', description: 'Лучшие стендап-комики страны в одном вечере. 18+.',
  },
  {
    id: 'e6', title: 'Новогодняя ёлка: шоу Деда Мороза', category: 'kids', venueId: 'friendship',
    date: d('2026-12-27T11:00:00'), officialMin: 80000, officialMax: 300000, soldOut: false,
    color: '#5BC8FF', emoji: '🎄', description: 'Интерактивное шоу с подарками для детей от 3 лет.',
  },
  {
    id: 'e7', title: 'Фестиваль «Шарк тароналари» — гала', category: 'festivals', venueId: 'registan',
    date: d('2026-12-05T19:00:00'), officialMin: 250000, officialMax: 1200000, soldOut: true,
    color: '#FF8FCF', emoji: '✨', description: 'Гала-вечер под открытым небом на Регистане.',
  },
  {
    id: 'e8', title: 'Иммерсивная выставка «Ван Гог»', category: 'exhibitions', venueId: 'forums',
    date: d('2026-11-30T10:00:00'), officialMin: 90000, officialMax: 150000, soldOut: false,
    color: '#8FA3FF', emoji: '🖼️', description: 'Мультимедийная выставка: проекции на 360°.',
  },
];

export type Seller = { id: string; name: string; rating: number; deals: number; verified: boolean; since: string };

export const SELLERS: Seller[] = [
  { id: 'u1', name: 'Азиз К.', rating: 4.9, deals: 34, verified: true, since: '2025' },
  { id: 'u2', name: 'Малика Р.', rating: 4.7, deals: 12, verified: true, since: '2026' },
  { id: 'u3', name: 'Тимур С.', rating: 4.2, deals: 3, verified: false, since: '2026' },
  { id: 'me', name: 'Равшан', rating: 5.0, deals: 2, verified: true, since: '2026' },
];

export type TicketType = 'electronic' | 'paper';
export type ListingStatus = 'active' | 'reserved' | 'sold' | 'draft';

export type Listing = {
  id: string;
  eventId: string;
  sellerId: string;
  sector: string;
  row?: string;
  seats?: string;
  qty: number;
  nominal: number; // цена по билету
  price: number; // цена продавца за 1 билет
  ticketType: TicketType;
  comment?: string;
  status: ListingStatus;
  createdAt: string;
  views: number;
};

export const LISTINGS: Listing[] = [
  { id: 'l1', eventId: 'e1', sellerId: 'u1', sector: 'Танцпол', qty: 2, nominal: 400000, price: 550000, ticketType: 'electronic', comment: 'Не смогу пойти, улетаю. Передам в приложении сразу после оплаты.', status: 'active', createdAt: d('2026-10-21T10:00:00'), views: 214 },
  { id: 'l2', eventId: 'e1', sellerId: 'u2', sector: 'VIP A', row: '3', seats: '12–13', qty: 2, nominal: 1450000, price: 1700000, ticketType: 'electronic', status: 'active', createdAt: d('2026-10-22T09:00:00'), views: 98 },
  { id: 'l3', eventId: 'e1', sellerId: 'u3', sector: 'Трибуна B', row: '18', seats: '5', qty: 1, nominal: 200000, price: 320000, ticketType: 'paper', comment: 'Бумажный билет, встреча в центре.', status: 'active', createdAt: d('2026-10-22T18:00:00'), views: 41 },
  { id: 'l4', eventId: 'e2', sellerId: 'u2', sector: 'Партер', row: '7', seats: '8–9', qty: 2, nominal: 500000, price: 560000, ticketType: 'electronic', status: 'active', createdAt: d('2026-10-20T12:00:00'), views: 73 },
  { id: 'l5', eventId: 'e4', sellerId: 'u1', sector: 'Бельэтаж', row: '2', seats: '14', qty: 1, nominal: 300000, price: 380000, ticketType: 'electronic', status: 'active', createdAt: d('2026-10-19T15:00:00'), views: 55 },
  { id: 'l6', eventId: 'e5', sellerId: 'u3', sector: 'Партер', row: '4', seats: '1–3', qty: 3, nominal: 400000, price: 450000, ticketType: 'electronic', status: 'active', createdAt: d('2026-10-23T08:00:00'), views: 17 },
  { id: 'l7', eventId: 'e7', sellerId: 'u1', sector: 'Зона A', qty: 2, nominal: 1200000, price: 1500000, ticketType: 'electronic', status: 'active', createdAt: d('2026-10-18T11:00:00'), views: 160 },
  { id: 'l8', eventId: 'e3', sellerId: 'u2', sector: 'Восточная трибуна', row: '10', seats: '22–25', qty: 4, nominal: 60000, price: 60000, ticketType: 'electronic', comment: 'Отдаю по номиналу.', status: 'active', createdAt: d('2026-10-22T20:00:00'), views: 22 },
  { id: 'l9', eventId: 'e6', sellerId: 'u1', sector: 'Партер', row: '6', seats: '10–11', qty: 2, nominal: 200000, price: 200000, ticketType: 'electronic', status: 'active', createdAt: d('2026-10-21T13:00:00'), views: 30 },
  // мои объявления
  { id: 'm1', eventId: 'e2', sellerId: 'me', sector: 'Амфитеатр', row: '2', seats: '3', qty: 1, nominal: 300000, price: 350000, ticketType: 'electronic', status: 'active', createdAt: d('2026-10-22T10:00:00'), views: 39 },
  { id: 'm2', eventId: 'e5', sellerId: 'me', sector: 'Балкон', row: '1', seats: '7–8', qty: 2, nominal: 150000, price: 190000, ticketType: 'electronic', status: 'sold', createdAt: d('2026-10-15T10:00:00'), views: 120 },
];

export const MAX_MARKUP = 0.5; // ограничение наценки +50% к номиналу (защита от спекуляции)
export const SERVICE_FEE = 0.07; // комиссия сервиса с покупателя
