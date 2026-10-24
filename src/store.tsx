import React, { createContext, useContext, useMemo, useState } from 'react';
import { EVENTS, LISTINGS, Listing, Event, SELLERS, VENUES, CITIES } from './data';
import { colors } from './theme';
import { DEFAULT_LANG, DICTS, Dict, Lang, setCurrentLang } from './i18n';

// Что показывать в шапке объявления: данные события, если оно привязано, иначе название от продавца.
export type ListingView = { title: string; emoji: string; color: string; date?: string; venue?: string; eventId?: string };

// Заявка на покупку: уходит операторам, дальше сделку ведёт оператор (оплата — вне приложения).
export type Role = 'buyer' | 'seller';

export type PurchaseRequest = { id: string; listingId: string; qty: number; subtotal: number; fee: number; total: number; name: string; phone: string; date: string; status: 'processing' };

type Store = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  user: { id: string; name: string; phone: string; role: Role } | null;
  login: (name: string, phone: string, role: Role) => void;
  setRole: (role: Role) => void;
  logout: () => void;
  city: string;
  setCity: (c: string) => void;
  events: Event[];
  listings: Listing[];
  addListing: (l: Omit<Listing, 'id' | 'createdAt' | 'views' | 'sellerId' | 'status' | 'city'>) => Listing;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  removeListing: (id: string) => void;
  favorites: string[];
  toggleFavorite: (eventId: string) => void;
  requests: PurchaseRequest[];
  sendRequest: (r: Omit<PurchaseRequest, 'id' | 'date' | 'status'>) => void;
  getEvent: (id: string) => Event | undefined;
  getVenue: (id: string) => (typeof VENUES)[number] | undefined;
  getSeller: (id: string) => (typeof SELLERS)[number] | undefined;
  activeListingsFor: (eventId: string) => Listing[];
  listingView: (l: Listing) => ListingView;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  setCurrentLang(lang);
  // Без регистрации (имя, телефон, роль) нельзя продавать; демо-объявления 'me' станут видны после неё.
  const [user, setUser] = useState<Store['user']>(null);
  const [city, setCity] = useState(CITIES[0]);
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [favorites, setFavorites] = useState<string[]>(['e1']);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);

  const value = useMemo<Store>(() => ({
    lang,
    setLang,
    t: DICTS[lang],
    user,
    login: (name, phone, role) => setUser({ id: 'me', name, phone, role }),
    setRole: (role) => setUser((u) => (u ? { ...u, role } : u)),
    logout: () => setUser(null),
    city,
    setCity,
    events: EVENTS,
    listings,
    addListing: (l) => {
      const full: Listing = { ...l, city, id: 'n' + Date.now(), createdAt: new Date().toISOString(), views: 0, sellerId: 'me', status: 'active' };
      setListings((prev) => [full, ...prev]);
      return full;
    },
    updateListing: (id, patch) => setListings((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removeListing: (id) => setListings((prev) => prev.filter((x) => x.id !== id)),
    favorites,
    toggleFavorite: (eventId) =>
      setFavorites((prev) => (prev.includes(eventId) ? prev.filter((x) => x !== eventId) : [...prev, eventId])),
    requests,
    sendRequest: (r) =>
      setRequests((prev) => [{ ...r, id: 'r' + Date.now(), date: new Date().toISOString(), status: 'processing' }, ...prev]),
    getEvent: (id) => EVENTS.find((e) => e.id === id),
    getVenue: (id) => VENUES.find((v) => v.id === id),
    getSeller: (id) => SELLERS.find((s) => s.id === id),
    activeListingsFor: (eventId) =>
      listings.filter((l) => l.eventId === eventId && l.status === 'active').sort((a, b) => a.price - b.price),
    listingView: (l) => {
      const e = l.eventId ? EVENTS.find((x) => x.id === l.eventId) : undefined;
      if (!e) return { title: l.title ?? '', emoji: '🎟️', color: colors.surface2 };
      return { title: e.title, emoji: e.emoji, color: e.color, date: e.date, venue: VENUES.find((v) => v.id === e.venueId)?.name, eventId: e.id };
    },
  }), [lang, user, city, listings, favorites, requests]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('StoreProvider missing');
  return v;
};
