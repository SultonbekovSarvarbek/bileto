// Справочники и демо-данные. Позже заменяются API.
import type { ImageSourcePropType } from 'react-native';

export const CITIES = ['Ташкент', 'Самарканд', 'Бухара', 'Наманган', 'Андижан', 'Фергана', 'Нукус'];

export type Venue = { id: string; name: string; city: string };

export const VENUES: Venue[] = [
  { id: 'humo', name: 'Humo Arena', city: 'Ташкент' },
  { id: 'milliy', name: 'Стадион «Миллий»', city: 'Ташкент' },
  { id: 'navoi', name: 'Театр оперы и балета им. Навои', city: 'Ташкент' },
  { id: 'forums', name: 'Дворец международных форумов', city: 'Ташкент' },
  { id: 'turkiston', name: 'Дворец искусств «Туркистон»', city: 'Ташкент' },
  { id: 'friendship', name: 'Дворец дружбы народов', city: 'Ташкент' },
  { id: 'registan', name: 'Площадь Регистан', city: 'Самарканд' },
];

export type Event = {
  id: string;
  title: string;
  venueId: string;
  date: string; // ISO
  officialMin: number;
  officialMax: number;
  soldOut: boolean;
  image: ImageSourcePropType; // обложка, см. assets/covers/CREDITS.md
  description: string;
};

const d = (s: string) => new Date(s).toISOString();

export const EVENTS: Event[] = [
  {
    id: 'e1', title: 'Пахтакор — Насаф. Суперлига', venueId: 'milliy',
    date: d('2026-11-02T18:00:00'), officialMin: 30000, officialMax: 150000, soldOut: true,
    image: require('../assets/covers/football.jpg'),
    description: 'Центральный матч тура Суперлиги Узбекистана. Билеты на Восточную и Западную трибуны в кассе закончились за два дня.',
  },
  {
    id: 'e2', title: 'Осенний хит-парад: большой поп-концерт', venueId: 'humo',
    date: d('2026-11-07T20:00:00'), officialMin: 200000, officialMax: 1450000, soldOut: true,
    image: require('../assets/covers/pop.jpg'),
    description: 'Главный поп-концерт сезона: звёзды узбекской эстрады, живой звук и световое шоу. Танцпол и VIP-зоны.',
  },
  {
    id: 'e3', title: 'Большой стендап-вечер', venueId: 'turkiston',
    date: d('2026-11-09T19:30:00'), officialMin: 150000, officialMax: 600000, soldOut: true,
    image: require('../assets/covers/standup.jpg'),
    description: 'Пять комиков, два часа нового материала на русском и узбекском. 18+.',
  },
  {
    id: 'e4', title: 'Музыка кино: симфонический концерт', venueId: 'forums',
    date: d('2026-11-14T19:00:00'), officialMin: 170000, officialMax: 800000, soldOut: true,
    image: require('../assets/covers/orchestra.jpg'),
    description: 'Симфонический оркестр исполняет саундтреки к известным фильмам и сериалам.',
  },
  {
    id: 'e5', title: 'Хоккей: «Хумо» — домашний матч', venueId: 'humo',
    date: d('2026-11-15T19:00:00'), officialMin: 50000, officialMax: 250000, soldOut: false,
    image: require('../assets/covers/hockey.jpg'),
    description: 'Домашний матч хоккейного клуба «Хумо». Нижний ярус — ближе к площадке.',
  },
  {
    id: 'e6', title: 'Балет «Лебединое озеро»', venueId: 'navoi',
    date: d('2026-11-21T18:30:00'), officialMin: 100000, officialMax: 450000, soldOut: true,
    image: require('../assets/covers/ballet.jpg'),
    description: 'Классический балет П. И. Чайковского в двух действиях. Продолжительность — 2 ч 40 мин с антрактом.',
  },
  {
    id: 'e7', title: 'Иммерсивная выставка «Ван Гог»', venueId: 'forums',
    date: d('2026-11-30T10:00:00'), officialMin: 90000, officialMax: 150000, soldOut: false,
    image: require('../assets/covers/vangogh.jpg'),
    description: 'Картины Ван Гога в проекциях на 360°: стены, пол и музыка. Сеанс — 1 час.',
  },
  {
    id: 'e8', title: 'Гала-концерт на Регистане', venueId: 'registan',
    date: d('2026-12-05T19:00:00'), officialMin: 250000, officialMax: 1200000, soldOut: true,
    image: require('../assets/covers/registan.jpg'),
    description: 'Концерт под открытым небом на фоне подсвеченных медресе Регистана.',
  },
  {
    id: 'e9', title: 'Новогодняя ёлка: шоу для детей', venueId: 'friendship',
    date: d('2026-12-27T11:00:00'), officialMin: 80000, officialMax: 300000, soldOut: true,
    image: require('../assets/covers/newyear.jpg'),
    description: 'Интерактивное шоу с Дедом Морозом и Снегурочкой и подарками для детей от 3 лет.',
  },
];

export type Seller = { id: string; name: string; phone: string; rating: number; deals: number; verified: boolean; since: string };

export const SELLERS: Seller[] = [
  { id: 'u1', name: 'Азиз К.', phone: '+998901112233', rating: 4.9, deals: 34, verified: true, since: '2025' },
  { id: 'u2', name: 'Малика Р.', phone: '+998935554411', rating: 4.8, deals: 17, verified: true, since: '2025' },
  { id: 'u3', name: 'Тимур С.', phone: '+998977003355', rating: 4.5, deals: 6, verified: false, since: '2026' },
  { id: 'u4', name: 'Дилноза А.', phone: '+998946207788', rating: 5.0, deals: 9, verified: true, since: '2026' },
  { id: 'u5', name: 'Шерзод М.', phone: '+998998402211', rating: 4.6, deals: 11, verified: true, since: '2025' },
  { id: 'u6', name: 'Нигора Т.', phone: '+998911305566', rating: 4.3, deals: 2, verified: false, since: '2026' },
  // текущий пользователь: имя и телефон берутся из регистрации
  { id: 'me', name: '', phone: '', rating: 0, deals: 0, verified: false, since: '2026' },
];

export type Delivery = 'delivery' | 'pickup';
export type ListingStatus = 'active' | 'reserved' | 'sold' | 'draft';

export type Listing = {
  id: string;
  eventId?: string; // есть, если объявление создано со страницы события
  title?: string; // название, которое ввёл продавец
  city?: string;
  sellerId: string;
  sector: string;
  row?: string;
  seats?: string;
  qty: number;
  price: number; // цена продавца за 1 билет
  delivery: Delivery; // доставка покупателю или самовывоз у продавца
  comment?: string;
  status: ListingStatus;
  createdAt: string;
  views: number;
};

export const LISTINGS: Listing[] = [
  { id: 'l1', eventId: 'e1', sellerId: 'u5', sector: 'Восточная трибуна', row: '12', seats: '21–22', qty: 2, price: 120000, delivery: 'pickup', comment: 'Брат не прилетает, два места рядом. Встретимся у стадиона.', status: 'active', createdAt: d('2026-10-23T19:40:00'), views: 87 },
  { id: 'l2', eventId: 'e1', sellerId: 'u3', sector: 'Западная трибуна', row: '4', seats: '9', qty: 1, price: 90000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-24T08:15:00'), views: 23 },
  { id: 'l3', eventId: 'e2', sellerId: 'u1', sector: 'Танцпол', qty: 2, price: 550000, delivery: 'delivery', comment: 'Улетаю в командировку. Билеты электронные, перешлю после звонка оператора.', status: 'active', createdAt: d('2026-10-21T10:00:00'), views: 214 },
  { id: 'l4', eventId: 'e2', sellerId: 'u2', sector: 'VIP A', row: '3', seats: '12–13', qty: 2, price: 1700000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-22T09:00:00'), views: 98 },
  { id: 'l5', eventId: 'e2', sellerId: 'u6', sector: 'Трибуна B', row: '18', seats: '5', qty: 1, price: 320000, delivery: 'pickup', comment: 'Бумажный билет, могу передать в районе Ц-1.', status: 'active', createdAt: d('2026-10-22T18:00:00'), views: 41 },
  { id: 'l6', eventId: 'e3', sellerId: 'u4', sector: 'Партер', row: '4', seats: '1–3', qty: 3, price: 450000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-23T08:00:00'), views: 56 },
  { id: 'l7', eventId: 'e4', sellerId: 'u2', sector: 'Партер', row: '7', seats: '8–9', qty: 2, price: 560000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-20T12:00:00'), views: 73 },
  { id: 'l8', eventId: 'e4', sellerId: 'u5', sector: 'Амфитеатр', row: '2', seats: '3', qty: 1, price: 300000, delivery: 'pickup', status: 'active', createdAt: d('2026-10-23T21:10:00'), views: 19 },
  { id: 'l9', eventId: 'e5', sellerId: 'u3', sector: 'Сектор 104', row: '6', seats: '14–17', qty: 4, price: 70000, delivery: 'pickup', comment: 'Отдаю по цене кассы — компания не собралась.', status: 'active', createdAt: d('2026-10-24T11:30:00'), views: 12 },
  { id: 'l10', eventId: 'e6', sellerId: 'u1', sector: 'Бельэтаж', row: '2', seats: '14', qty: 1, price: 380000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-19T15:00:00'), views: 55 },
  { id: 'l11', eventId: 'e6', sellerId: 'u4', sector: 'Партер', row: '9', seats: '20–21', qty: 2, price: 520000, delivery: 'delivery', comment: 'Отличные места по центру зала.', status: 'active', createdAt: d('2026-10-22T13:20:00'), views: 64 },
  { id: 'l12', eventId: 'e7', sellerId: 'u6', sector: 'Сеанс 18:00', qty: 2, price: 110000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-24T09:50:00'), views: 8 },
  { id: 'l13', eventId: 'e8', sellerId: 'u1', sector: 'Зона A', qty: 2, price: 1500000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-18T11:00:00'), views: 160 },
  { id: 'l14', eventId: 'e9', sellerId: 'u2', sector: 'Партер', row: '6', seats: '10–11', qty: 2, price: 220000, delivery: 'delivery', comment: 'Ребёнок заболел, не сможем пойти.', status: 'active', createdAt: d('2026-10-21T13:00:00'), views: 30 },
];

export const SERVICE_FEE = 0.07; // сервисный сбор с покупателя
export const SELLER_COMMISSION = 0.1; // Bileto удерживает с продавца с каждого проданного билета
