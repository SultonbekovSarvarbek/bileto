import React, { createContext, useContext, useMemo, useState } from 'react';
import { EVENTS, LISTINGS, Listing, Event, SELLERS, VENUES, CITIES } from './data';

export type Purchase = { id: string; listingId: string; qty: number; total: number; date: string; status: 'paid' | 'transferred' };

type Store = {
  user: { id: string; name: string; phone: string } | null;
  login: (phone: string) => void;
  logout: () => void;
  city: string;
  setCity: (c: string) => void;
  events: Event[];
  listings: Listing[];
  addListing: (l: Omit<Listing, 'id' | 'createdAt' | 'views' | 'sellerId' | 'status'>) => Listing;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  removeListing: (id: string) => void;
  favorites: string[];
  toggleFavorite: (eventId: string) => void;
  purchases: Purchase[];
  buy: (listingId: string, qty: number, total: number) => void;
  getEvent: (id: string) => Event | undefined;
  getVenue: (id: string) => (typeof VENUES)[number] | undefined;
  getSeller: (id: string) => (typeof SELLERS)[number] | undefined;
  activeListingsFor: (eventId: string) => Listing[];
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Store['user']>({ id: 'me', name: 'Равшан', phone: '+998 90 123-45-67' });
  const [city, setCity] = useState(CITIES[0]);
  const [listings, setListings] = useState<Listing[]>(LISTINGS);
  const [favorites, setFavorites] = useState<string[]>(['e1']);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const value = useMemo<Store>(() => ({
    user,
    login: (phone) => setUser({ id: 'me', name: 'Равшан', phone }),
    logout: () => setUser(null),
    city,
    setCity,
    events: EVENTS,
    listings,
    addListing: (l) => {
      const full: Listing = { ...l, id: 'n' + Date.now(), createdAt: new Date().toISOString(), views: 0, sellerId: 'me', status: 'active' };
      setListings((prev) => [full, ...prev]);
      return full;
    },
    updateListing: (id, patch) => setListings((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    removeListing: (id) => setListings((prev) => prev.filter((x) => x.id !== id)),
    favorites,
    toggleFavorite: (eventId) =>
      setFavorites((prev) => (prev.includes(eventId) ? prev.filter((x) => x !== eventId) : [...prev, eventId])),
    purchases,
    buy: (listingId, qty, total) => {
      setPurchases((prev) => [{ id: 'p' + Date.now(), listingId, qty, total, date: new Date().toISOString(), status: 'paid' }, ...prev]);
      setListings((prev) =>
        prev.map((x) => {
          if (x.id !== listingId) return x;
          const left = x.qty - qty;
          return left > 0 ? { ...x, qty: left } : { ...x, qty: 0, status: 'sold' };
        }),
      );
    },
    getEvent: (id) => EVENTS.find((e) => e.id === id),
    getVenue: (id) => VENUES.find((v) => v.id === id),
    getSeller: (id) => SELLERS.find((s) => s.id === id),
    activeListingsFor: (eventId) =>
      listings.filter((l) => l.eventId === eventId && l.status === 'active').sort((a, b) => a.price - b.price),
  }), [user, city, listings, favorites, purchases]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('StoreProvider missing');
  return v;
};
