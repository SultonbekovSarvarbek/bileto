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

// Продавец, как его отдаёт API: телефон покупателю виден только размытым.
export type Seller = { id: string; name: string; phoneMasked: string; verified: boolean; since: string };

export type Delivery = 'delivery' | 'pickup';
export type ListingStatus = 'active' | 'sold' | 'closed'; // closed — снято продавцом или модератором

export type Listing = {
  id: string;
  eventId?: string; // событие из каталога EVENTS: обложка, дата, площадка
  title: string; // название, которое ввёл продавец
  city: string;
  sellerId: string;
  sector: string;
  row?: string;
  seats?: string;
  description?: string; // комментарий продавца, без контактов
  coverUrl?: string; // афиша события с бэкенда; важнее обложки каталога
  qty: number; // сколько ещё в продаже
  price: number; // цена продавца за 1 билет
  delivery: Delivery; // доставка покупателю или самовывоз у продавца
  status: ListingStatus;
  createdAt: string;
  views: number;
};

export const SERVICE_FEE = 0.07; // сервисный сбор с покупателя
export const SELLER_COMMISSION = 0.1; // Bileto удерживает с продавца с каждого проданного билета
