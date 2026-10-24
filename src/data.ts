// Справочники и демо-данные. Позже заменяются API.
import type { ImageSourcePropType } from 'react-native';

export const CITIES = ['Ташкент', 'Самарканд', 'Бухара', 'Наманган', 'Андижан', 'Фергана', 'Нукус'];

export type Venue = { id: string; name: string; city: string };

export const VENUES: Venue[] = [
  { id: 'friendship', name: 'Дворец «Дружбы народов»', city: 'Ташкент' },
  { id: 'humo', name: 'Humo Arena', city: 'Ташкент' },
  { id: 'pakhtakor', name: 'Стадион «Пахтакор»', city: 'Ташкент' },
  { id: 'forums', name: 'Дворец международных форумов', city: 'Ташкент' },
  { id: 'panorama', name: 'Дворец киноискусства «Панорама»', city: 'Ташкент' },
  { id: 'navoi', name: 'ГАБТ им. Алишера Навои', city: 'Ташкент' },
  { id: 'turkiston', name: 'Дворец искусств «Туркистон»', city: 'Ташкент' },
  { id: 'russian-drama', name: 'Академический русский драматический театр', city: 'Ташкент' },
  { id: 'tyuz', name: 'Театр юного зрителя', city: 'Ташкент' },
  { id: 'yunusabad', name: 'СК «Юнусабад»', city: 'Ташкент' },
  { id: 'railway', name: 'Дворец культуры железнодорожников', city: 'Ташкент' },
  { id: 'samarkand-theatre', name: 'Театр музыки и драмы им. Х. Алимджана', city: 'Самарканд' },
];

export type Event = {
  id: string;
  title: string;
  venueId: string;
  date: string; // ISO
  officialMin: number;
  officialMax: number;
  soldOut: boolean;
  image: ImageSourcePropType; // обложка по типу события, см. assets/covers/CREDITS.md
  description: string;
};

const d = (s: string) => new Date(s).toISOString();

const COVER = {
  pop: require('../assets/covers/pop.jpg'),
  rock: require('../assets/covers/rock.jpg'),
  festival: require('../assets/covers/festival.jpg'),
  orchestra: require('../assets/covers/orchestra.jpg'),
  ballet: require('../assets/covers/ballet.jpg'),
  theatre: require('../assets/covers/theatre.jpg'),
  standup: require('../assets/covers/standup.jpg'),
  football: require('../assets/covers/football.jpg'),
  newyear: require('../assets/covers/newyear.jpg'),
  samarkand: require('../assets/covers/registan.jpg'),
};

// Примеры реальных событий с афиши iTicket.uz (октябрь 2026). Время — ташкентское, цены — касса.
export const EVENTS: Event[] = [
  { id: 'e1', title: 'Max Richter', venueId: 'forums', date: d('2026-10-27T19:00:00+05:00'), officialMin: 500000, officialMax: 2000000, soldOut: false, image: COVER.orchestra, description: 'Неоклассика и музыка к фильмам в живом исполнении. 6+.' },
  { id: 'e2', title: 'NASRIDDIN AFANDI', venueId: 'tyuz', date: d('2026-10-28T18:00:00+05:00'), officialMin: 55000, officialMax: 55000, soldOut: true, image: COVER.theatre, description: 'Спектакль о Насреддине Афанди. 12+. В кассе билетов нет.' },
  { id: 'e3', title: 'The Universe of Hans Zimmer 2.0 (Самарканд)', venueId: 'samarkand-theatre', date: d('2026-10-28T19:00:00+05:00'), officialMin: 300000, officialMax: 800000, soldOut: false, image: COVER.samarkand, description: 'Музыка Ханса Циммера в исполнении оркестра. 6+.' },
  { id: 'e4', title: 'The Universe of Hans Zimmer 2.0', venueId: 'friendship', date: d('2026-10-29T19:30:00+05:00'), officialMin: 160000, officialMax: 800000, soldOut: false, image: COVER.orchestra, description: 'Саундтреки «Интерстеллара», «Дюны», «Пиратов Карибского моря» с оркестром. 6+.' },
  { id: 'e5', title: 'Валерий Меладзе', venueId: 'friendship', date: d('2026-10-30T19:30:00+05:00'), officialMin: 250000, officialMax: 3300000, soldOut: false, image: COVER.pop, description: 'Большой сольный концерт. 6+.' },
  { id: 'e6', title: 'Чёрная бурка', venueId: 'russian-drama', date: d('2026-10-30T19:00:00+05:00'), officialMin: 55000, officialMax: 88000, soldOut: false, image: COVER.theatre, description: 'Спектакль Русского драмтеатра. 14+.' },
  { id: 'e7', title: 'Леонид Агутин', venueId: 'friendship', date: d('2026-10-31T19:30:00+05:00'), officialMin: 350000, officialMax: 3500000, soldOut: false, image: COVER.pop, description: 'Сольный концерт с живым бэндом. 0+.' },
  { id: 'e8', title: 'SHOXRUX', venueId: 'humo', date: d('2026-11-01T18:00:00+05:00'), officialMin: 180000, officialMax: 950000, soldOut: false, image: COVER.pop, description: 'Сольный концерт в Humo Arena. 5+.' },
  { id: 'e9', title: 'Пахтакор — Аль-Наср', venueId: 'pakhtakor', date: d('2026-11-02T18:45:00+05:00'), officialMin: 100000, officialMax: 3000000, soldOut: false, image: COVER.football, description: 'Международный матч на стадионе «Пахтакор». 3+.' },
  { id: 'e10', title: 'Pink Floyd Legacy', venueId: 'panorama', date: d('2026-11-04T19:00:00+05:00'), officialMin: 200000, officialMax: 1500000, soldOut: false, image: COVER.rock, description: 'Шоу-трибьют Pink Floyd: хиты и световое шоу. 5+.' },
  { id: 'e11', title: 'Cheb Mami', venueId: 'humo', date: d('2026-11-07T20:00:00+05:00'), officialMin: 150000, officialMax: 2000000, soldOut: false, image: COVER.pop, description: 'Концерт «принца раи» в Ташкенте. 5+.' },
  { id: 'e12', title: 'Бременские музыканты — детский спектакль', venueId: 'navoi', date: d('2026-11-08T12:00:00+05:00'), officialMin: 55000, officialMax: 110000, soldOut: false, image: COVER.theatre, description: 'Мюзикл Г. Гладкова для всей семьи. 6+.' },
  { id: 'e13', title: 'Дж. Верди «Травиата»', venueId: 'navoi', date: d('2026-11-08T19:00:00+05:00'), officialMin: 77000, officialMax: 440000, soldOut: false, image: COVER.theatre, description: 'Опера в трёх действиях. 12+.' },
  { id: 'e14', title: 'С. Прокофьев «Ромео и Джульетта»', venueId: 'navoi', date: d('2026-11-13T19:00:00+05:00'), officialMin: 77000, officialMax: 220000, soldOut: false, image: COVER.ballet, description: 'Балет в трёх действиях. 12+.' },
  { id: 'e15', title: 'Фестиваль «Осенняя история»', venueId: 'humo', date: d('2026-11-15T19:00:00+05:00'), officialMin: 250000, officialMax: 1166000, soldOut: false, image: COVER.festival, description: 'Большой музыкальный фестиваль в Humo Arena. 12+.' },
  { id: 'e16', title: 'Пошлая Молли', venueId: 'yunusabad', date: d('2026-11-22T20:00:00+05:00'), officialMin: 825000, officialMax: 1650000, soldOut: false, image: COVER.rock, description: 'Концерт группы. 18+.' },
  { id: 'e17', title: 'LVBEL C5', venueId: 'humo', date: d('2026-12-09T19:00:00+05:00'), officialMin: 150000, officialMax: 1500000, soldOut: false, image: COVER.pop, description: 'Концерт в Humo Arena. 12+.' },
  { id: 'e18', title: 'Группа «Секрет»', venueId: 'panorama', date: d('2026-12-11T19:30:00+05:00'), officialMin: 350000, officialMax: 1500000, soldOut: false, image: COVER.rock, description: 'Легендарная ленинградская группа, все хиты. 0+.' },
  { id: 'e19', title: 'Ефим Шифрин «Стендап и… немножко музыки»', venueId: 'russian-drama', date: d('2026-12-12T19:00:00+05:00'), officialMin: 400000, officialMax: 2000000, soldOut: false, image: COVER.standup, description: 'Стендап и песни. 12+.' },
  { id: 'e20', title: 'Маша и Медведь — новогоднее шоу', venueId: 'railway', date: d('2026-12-12T12:00:00+05:00'), officialMin: 100000, officialMax: 350000, soldOut: false, image: COVER.newyear, description: 'Новогоднее шоу для детей. 0+.' },
  { id: 'e21', title: 'ANIME. Саундтрек-концерт', venueId: 'turkiston', date: d('2026-12-13T19:00:00+05:00'), officialMin: 66000, officialMax: 275000, soldOut: false, image: COVER.orchestra, description: 'Музыка из аниме в исполнении оркестра. 0+.' },
  { id: 'e22', title: 'Щелкунчик', venueId: 'friendship', date: d('2026-12-27T13:30:00+05:00'), officialMin: 40000, officialMax: 450000, soldOut: false, image: COVER.ballet, description: 'Новогодний балет П. И. Чайковского. 6+.' },
  { id: 'e23', title: 'Yangi yil shou', venueId: 'humo', date: d('2026-12-27T19:00:00+05:00'), officialMin: 100000, officialMax: 400000, soldOut: false, image: COVER.newyear, description: 'Новогоднее шоу звёзд узбекской эстрады. 5+.' },
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
  { id: 'l1', eventId: 'e1', sellerId: 'u2', sector: 'Партер', row: '5', seats: '11–12', qty: 2, price: 1800000, delivery: 'delivery', comment: 'Электронные билеты, перешлю после звонка оператора.', status: 'active', createdAt: d('2026-10-22T09:00:00'), views: 90 },
  { id: 'l2', eventId: 'e2', sellerId: 'u3', sector: 'Партер', row: '7', seats: '4', qty: 1, price: 90000, delivery: 'pickup', comment: 'В кассе уже нет. Отдам у театра.', status: 'active', createdAt: d('2026-10-23T18:30:00'), views: 143 },
  { id: 'l3', eventId: 'e3', sellerId: 'u6', sector: 'Партер', row: '3', seats: '8–9', qty: 2, price: 600000, delivery: 'pickup', status: 'active', createdAt: d('2026-10-24T10:10:00'), views: 196 },
  { id: 'l4', eventId: 'e4', sellerId: 'u1', sector: 'Партер', row: '12', seats: '15–16', qty: 2, price: 650000, delivery: 'delivery', comment: 'Не смогу пойти — командировка.', status: 'active', createdAt: d('2026-10-21T10:00:00'), views: 249 },
  { id: 'l5', eventId: 'e4', sellerId: 'u5', sector: 'Балкон', row: '2', seats: '30', qty: 1, price: 220000, delivery: 'pickup', status: 'active', createdAt: d('2026-10-24T08:20:00'), views: 62 },
  { id: 'l6', eventId: 'e5', sellerId: 'u2', sector: 'VIP', row: '2', seats: '7–8', qty: 2, price: 3000000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-20T12:00:00'), views: 115 },
  { id: 'l7', eventId: 'e5', sellerId: 'u4', sector: 'Партер', row: '15', seats: '21', qty: 1, price: 900000, delivery: 'delivery', comment: 'Отличный вид на сцену.', status: 'active', createdAt: d('2026-10-23T21:40:00'), views: 168 },
  { id: 'l8', eventId: 'e6', sellerId: 'u6', sector: 'Партер', row: '6', seats: '10–11', qty: 2, price: 80000, delivery: 'pickup', status: 'active', createdAt: d('2026-10-24T11:00:00'), views: 221 },
  { id: 'l9', eventId: 'e7', sellerId: 'u1', sector: 'Партер', row: '4', seats: '17–18', qty: 2, price: 2500000, delivery: 'delivery', comment: 'Подарок не пригодился, отдаю пару.', status: 'active', createdAt: d('2026-10-22T15:30:00'), views: 274 },
  { id: 'l10', eventId: 'e7', sellerId: 'u3', sector: 'Амфитеатр', row: '9', seats: '5', qty: 1, price: 600000, delivery: 'pickup', status: 'active', createdAt: d('2026-10-24T09:45:00'), views: 87 },
  { id: 'l11', eventId: 'e8', sellerId: 'u5', sector: 'Танцпол', qty: 3, price: 250000, delivery: 'delivery', comment: 'Компания не собралась.', status: 'active', createdAt: d('2026-10-23T13:00:00'), views: 140 },
  { id: 'l12', eventId: 'e8', sellerId: 'u4', sector: 'VIP B', row: '1', seats: '4–5', qty: 2, price: 1100000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-24T07:50:00'), views: 193 },
  { id: 'l13', eventId: 'e9', sellerId: 'u5', sector: 'Восточная трибуна', row: '14', seats: '21–23', qty: 3, price: 250000, delivery: 'pickup', comment: 'Встретимся у входа на стадион.', status: 'active', createdAt: d('2026-10-23T19:40:00'), views: 246 },
  { id: 'l14', eventId: 'e9', sellerId: 'u1', sector: 'VIP-ложа', qty: 2, price: 3500000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-24T12:05:00'), views: 59 },
  { id: 'l15', eventId: 'e9', sellerId: 'u6', sector: 'Западная трибуна', row: '8', seats: '9', qty: 1, price: 180000, delivery: 'pickup', status: 'active', createdAt: d('2026-10-24T13:30:00'), views: 112 },
  { id: 'l16', eventId: 'e10', sellerId: 'u2', sector: 'Партер', row: '10', seats: '12–13', qty: 2, price: 900000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-21T11:20:00'), views: 165 },
  { id: 'l17', eventId: 'e11', sellerId: 'u4', sector: 'Танцпол', qty: 2, price: 300000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-22T17:00:00'), views: 218 },
  { id: 'l18', eventId: 'e12', sellerId: 'u3', sector: 'Бельэтаж', row: '2', seats: '14–16', qty: 3, price: 90000, delivery: 'pickup', comment: 'Ребёнок заболел, не сможем пойти.', status: 'active', createdAt: d('2026-10-24T08:15:00'), views: 271 },
  { id: 'l19', eventId: 'e13', sellerId: 'u1', sector: 'Партер', row: '5', seats: '9–10', qty: 2, price: 450000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-19T15:00:00'), views: 84 },
  { id: 'l20', eventId: 'e14', sellerId: 'u4', sector: 'Партер', row: '9', seats: '20–21', qty: 2, price: 250000, delivery: 'delivery', comment: 'Отличные места по центру зала.', status: 'active', createdAt: d('2026-10-22T13:20:00'), views: 137 },
  { id: 'l21', eventId: 'e15', sellerId: 'u5', sector: 'Фан-зона', qty: 4, price: 350000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-23T10:30:00'), views: 190 },
  { id: 'l22', eventId: 'e16', sellerId: 'u6', sector: 'Танцпол', qty: 2, price: 950000, delivery: 'pickup', comment: '18+, на входе проверяют паспорт.', status: 'active', createdAt: d('2026-10-24T09:50:00'), views: 243 },
  { id: 'l23', eventId: 'e17', sellerId: 'u2', sector: 'Танцпол', qty: 2, price: 300000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-20T19:10:00'), views: 56 },
  { id: 'l24', eventId: 'e18', sellerId: 'u3', sector: 'Партер', row: '6', seats: '3–4', qty: 2, price: 1000000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-23T16:40:00'), views: 109 },
  { id: 'l25', eventId: 'e19', sellerId: 'u1', sector: 'Партер', row: '3', seats: '11', qty: 1, price: 1500000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-21T14:25:00'), views: 162 },
  { id: 'l26', eventId: 'e20', sellerId: 'u4', sector: 'Партер', row: '4', seats: '6–8', qty: 3, price: 250000, delivery: 'pickup', comment: 'Новогоднее шоу — купили лишние билеты.', status: 'active', createdAt: d('2026-10-24T10:40:00'), views: 215 },
  { id: 'l27', eventId: 'e21', sellerId: 'u6', sector: 'Партер', row: '8', seats: '17–18', qty: 2, price: 180000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-22T20:15:00'), views: 268 },
  { id: 'l28', eventId: 'e22', sellerId: 'u2', sector: 'Партер', row: '11', seats: '1–4', qty: 4, price: 300000, delivery: 'delivery', status: 'active', createdAt: d('2026-10-23T12:00:00'), views: 81 },
  { id: 'l29', eventId: 'e23', sellerId: 'u5', sector: 'Сектор A', row: '5', seats: '12–13', qty: 2, price: 250000, delivery: 'pickup', status: 'active', createdAt: d('2026-10-24T11:50:00'), views: 134 },
];

export const SERVICE_FEE = 0.07; // сервисный сбор с покупателя
export const SELLER_COMMISSION = 0.1; // Bileto удерживает с продавца с каждого проданного билета
