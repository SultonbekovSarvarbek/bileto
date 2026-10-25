import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EVENTS, Listing, Event, Seller, VENUES, CITIES, ListingStatus } from './data';
import type { ImageSourcePropType } from 'react-native';
import { DEFAULT_LANG, DICTS, Dict, Lang, setCurrentLang } from './i18n';
import { api, ApiError, ApiListing, ApiRequest, ApiUser, ListingInput, setToken, tokenStorage } from './api';

// Что показывать в шапке объявления: данные события, если оно привязано, иначе название от продавца.
export type ListingView = { title: string; image?: ImageSourcePropType; date?: string; venue?: string; eventId?: string };

export type Role = 'buyer' | 'seller';
export type User = { id: string; name: string; phone: string; role: Role; verified: boolean };

// Заявка на покупку: уходит операторам, дальше сделку ведёт оператор (оплата — вне приложения).
export type RequestStatus = 'processing' | 'done' | 'cancelled';
export type PurchaseRequest = {
  id: string;
  number?: number;
  listing: { id: string; eventId?: string; title: string; sector: string; row?: string };
  qty: number;
  total: number;
  date: string;
  status: RequestStatus;
};
export type RequestInput = { listingId: string; qty: number; name: string; phone: string };
export type ListingFields = Pick<Listing, 'eventId' | 'title' | 'sector' | 'row' | 'seats' | 'description' | 'qty' | 'price' | 'delivery'>;

type Store = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  ready: boolean; // сессия восстановлена из хранилища
  user: User | null;
  login: (name: string, phone: string, role: Role) => Promise<void>;
  setRole: (role: Role) => Promise<void>;
  logout: () => void;
  city: string;
  setCity: (c: string) => void;
  feed: { loading: boolean; error: boolean };
  refreshFeed: () => Promise<void>;
  events: Event[];
  listings: Listing[];
  loadListing: (id: string) => Promise<void>;
  isMine: (l: Listing) => boolean;
  addListing: (l: ListingFields, proofUri: string) => Promise<Listing>;
  updateListing: (id: string, patch: ListingFields, proofUri?: string) => Promise<void>;
  markSold: (id: string) => Promise<void>;
  removeListing: (id: string) => Promise<void>;
  favorites: string[]; // id объявлений
  toggleFavorite: (listingId: string) => void;
  requests: PurchaseRequest[];
  sendRequest: (r: RequestInput) => Promise<void>;
  getEvent: (id: string) => Event | undefined;
  getVenue: (id: string) => (typeof VENUES)[number] | undefined;
  getSeller: (id: string) => Seller | undefined;
  activeListingsFor: (eventId: string) => Listing[];
  listingView: (l: { eventId?: string; title: string; coverUrl?: string }) => ListingView;
};

const STATUS: Record<ApiListing['status'], ListingStatus> = { ACTIVE: 'active', SOLD: 'sold', REJECTED: 'closed', ARCHIVED: 'closed' };
const REQUEST_STATUS: Record<ApiRequest['status'], RequestStatus> = { NEW: 'processing', IN_PROGRESS: 'processing', DONE: 'done', CANCELLED: 'cancelled' };

const toListing = (l: ApiListing): Listing => ({
  id: l.id,
  eventId: l.eventId ?? undefined,
  title: l.title,
  city: l.city,
  sellerId: l.seller.id,
  sector: l.sector,
  row: l.row ?? undefined,
  seats: l.seats ?? undefined,
  description: l.description ?? undefined,
  coverUrl: l.coverUrl ?? undefined,
  qty: l.qtyAvailable,
  price: l.price,
  delivery: l.delivery === 'DELIVERY' ? 'delivery' : 'pickup',
  status: STATUS[l.status],
  createdAt: l.createdAt,
  views: l.views,
});
const toSeller = (s: ApiListing['seller']): Seller => ({
  id: s.id,
  name: s.name ?? '',
  phoneMasked: s.phoneMasked,
  verified: s.verified,
  since: s.createdAt.slice(0, 4),
});
const toUser = (u: ApiUser): User => ({ id: u.id, name: u.name ?? '', phone: u.phone, role: u.role === 'SELLER' ? 'seller' : 'buyer', verified: u.verified });
const toRequest = (r: ApiRequest): PurchaseRequest => ({
  id: r.id,
  number: r.number,
  listing: { id: r.listing.id, eventId: r.listing.eventId ?? undefined, title: r.listing.title, sector: r.listing.sector, row: r.listing.row ?? undefined },
  qty: r.qty,
  total: r.total,
  date: r.createdAt,
  status: REQUEST_STATUS[r.status],
});
const toInput = (l: ListingFields, city: string): ListingInput => ({
  ...l,
  city,
  delivery: l.delivery === 'delivery' ? 'DELIVERY' : 'PICKUP',
});

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  setCurrentLang(lang);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [city, setCityState] = useState(CITIES[0]);
  const [feed, setFeed] = useState({ loading: true, error: false });
  // Все объявления, которые приложение видело: лента, мои, избранные. Ключ — id.
  const [byId, setById] = useState<Record<string, Listing>>({});
  const [sellers, setSellers] = useState<Record<string, Seller>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);

  const upsert = useCallback((rows: ApiListing[]) => {
    setById((prev) => {
      const next = { ...prev };
      rows.forEach((r) => (next[r.id] = toListing(r)));
      return next;
    });
    setSellers((prev) => {
      const next = { ...prev };
      rows.forEach((r) => (next[r.seller.id] = toSeller(r.seller)));
      return next;
    });
  }, []);

  // Результат загрузки ленты; состояние меняется только в колбэке ответа.
  const applyFeed = useCallback(
    (p: Promise<{ items: ApiListing[] }>) =>
      p.then(
        ({ items }) => {
          upsert(items);
          setFeed({ loading: false, error: false });
        },
        () => setFeed({ loading: false, error: true }),
      ),
    [upsert],
  );

  useEffect(() => {
    void applyFeed(api.feed(city));
  }, [city, applyFeed]);

  const refreshFeed = useCallback(async () => {
    setFeed((f) => ({ ...f, loading: true }));
    await applyFeed(api.feed(city));
  }, [city, applyFeed]);

  // Мои объявления, избранное и заявки — после входа.
  const loadAccount = useCallback(async () => {
    const [mine, favs, reqs] = await Promise.all([api.myListings(), api.favorites(), api.myRequests()]);
    upsert([...mine, ...favs]);
    setFavorites(favs.map((l) => l.id));
    setRequests(reqs.map(toRequest));
  }, [upsert]);

  const signOut = useCallback(() => {
    setToken(null);
    void tokenStorage.clear().catch(() => undefined);
    setUser(null);
    setFavorites([]);
    setRequests([]);
  }, []);

  // Восстанавливаем сессию: токен из SecureStore → /me.
  useEffect(() => {
    (async () => {
      try {
        const saved = await tokenStorage.get();
        if (!saved) return;
        setToken(saved);
        const me = await api.me();
        setUser(toUser(me));
        if (me.lang in DICTS) setLangState(me.lang);
        await loadAccount();
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) signOut();
      } finally {
        setReady(true);
      }
    })();
  }, [loadAccount, signOut]);

  const listings = useMemo(() => Object.values(byId), [byId]);

  const value = useMemo<Store>(() => ({
    lang,
    setLang: (l) => {
      setLangState(l);
      if (user) void api.updateMe({ lang: l }).catch(() => undefined);
    },
    t: DICTS[lang],
    ready,
    user,
    login: async (name, phone, role) => {
      const res = await api.login(name, phone, role === 'seller' ? 'SELLER' : 'BUYER');
      setToken(res.token);
      await tokenStorage.set(res.token).catch(() => undefined);
      setUser(toUser(res.user));
      void api.updateMe({ lang }).catch(() => undefined);
      // Сердечки, поставленные до входа, сохраняем в аккаунт.
      await Promise.all(favorites.map((id) => api.addFavorite(id).catch(() => undefined)));
      await loadAccount().catch(() => undefined);
    },
    setRole: async (role) => {
      const me = await api.updateMe({ role: role === 'seller' ? 'SELLER' : 'BUYER' });
      setUser(toUser(me));
    },
    logout: signOut,
    city,
    setCity: (c) => {
      if (c === city) return;
      setFeed((f) => ({ ...f, loading: true }));
      setCityState(c);
    },
    feed,
    refreshFeed,
    events: EVENTS,
    listings,
    loadListing: async (id) => {
      upsert([await api.listing(id)]);
    },
    isMine: (l) => !!user && l.sellerId === user.id,
    addListing: async (l, proofUri) => {
      // Объявление на событие из каталога — в городе площадки, иначе в выбранном городе.
      const e = l.eventId ? EVENTS.find((x) => x.id === l.eventId) : undefined;
      const where = (e && VENUES.find((v) => v.id === e.venueId)?.city) || city;
      const created = await api.createListing(toInput(l, where), proofUri);
      upsert([created]);
      return toListing(created);
    },
    updateListing: async (id, patch, proofUri) => {
      const { city: _city, ...fields } = toInput(patch, city);
      void _city; // город объявления не меняется
      upsert([await api.updateListing(id, fields, proofUri)]);
    },
    markSold: async (id) => {
      await api.markSold(id);
      setById((prev) => ({ ...prev, [id]: { ...prev[id], status: 'sold', qty: 0 } }));
    },
    removeListing: async (id) => {
      await api.archiveListing(id);
      setById((prev) => ({ ...prev, [id]: { ...prev[id], status: 'closed' } }));
    },
    favorites,
    toggleFavorite: (listingId) => {
      const on = !favorites.includes(listingId);
      setFavorites((prev) => (on ? [...prev, listingId] : prev.filter((x) => x !== listingId)));
      if (!user) return; // гость: избранное только на устройстве до входа
      (on ? api.addFavorite(listingId) : api.removeFavorite(listingId)).catch(() =>
        setFavorites((prev) => (on ? prev.filter((x) => x !== listingId) : [...prev, listingId])),
      );
    },
    requests,
    sendRequest: async (r) => {
      const created = await api.sendRequest(r);
      setRequests((prev) => [toRequest(created), ...prev]);
    },
    getEvent: (id) => EVENTS.find((e) => e.id === id),
    getVenue: (id) => VENUES.find((v) => v.id === id),
    getSeller: (id) => sellers[id],
    activeListingsFor: (eventId) =>
      listings.filter((l) => l.eventId === eventId && l.status === 'active').sort((a, b) => a.price - b.price),
    listingView: (l) => {
      const e = l.eventId ? EVENTS.find((x) => x.id === l.eventId) : undefined;
      // Афиша события с бэкенда, иначе обложка каталога; без обеих Cover покажет заглушку.
      const cover = l.coverUrl ? { uri: l.coverUrl } : undefined;
      if (!e) return { title: l.title, image: cover };
      return { title: e.title, image: cover ?? e.image, date: e.date, venue: VENUES.find((v) => v.id === e.venueId)?.name, eventId: e.id };
    },
  }), [lang, ready, user, city, feed, refreshFeed, listings, sellers, favorites, requests, upsert, loadAccount, signOut]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('StoreProvider missing');
  return v;
};

// Текст ошибки для пользователя: сообщение бэкенда или «нет связи».
export function errorText(e: unknown, t: Dict) {
  if (e instanceof ApiError) return e.status === 0 || e.status >= 500 ? t.common.networkError : e.message;
  return t.common.networkError;
}
