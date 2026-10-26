import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Бэкенд Bileto. В разработке адрес берётся из .env.development (локальный бэк),
// для телефона в той же Wi-Fi сети — из .env.development.local с IP компьютера.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.bileto.uz/api';

// Фото продавцов бэкенд отдаёт путём без хоста (/photos/…), афиши — полным адресом.
export const mediaUrl = (path: string) => (path.startsWith('/') ? API_URL.replace(/\/api\/?$/, '') + path : path);

const TOKEN_KEY = 'bileto.token';

// SecureStore нет в вебе: там токен живёт в localStorage.
export const tokenStorage = {
  get: () => (Platform.OS === 'web' ? Promise.resolve(localStorage.getItem(TOKEN_KEY)) : SecureStore.getItemAsync(TOKEN_KEY)),
  set: (v: string) => (Platform.OS === 'web' ? Promise.resolve(localStorage.setItem(TOKEN_KEY, v)) : SecureStore.setItemAsync(TOKEN_KEY, v)),
  clear: () => (Platform.OS === 'web' ? Promise.resolve(localStorage.removeItem(TOKEN_KEY)) : SecureStore.deleteItemAsync(TOKEN_KEY)),
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

let token: string | null = null;
export const setToken = (t: string | null) => {
  token = t;
};

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const form = body instanceof FormData;
  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body && !form ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : form ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'network');
  }
  if (!res.ok) {
    // Nest отдаёт { message: string | string[] }
    const data = await res.json().catch(() => null);
    const msg = Array.isArray(data?.message) ? data.message[0] : data?.message;
    throw new ApiError(res.status, msg || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ——— Типы ответов бэкенда ———

export type ApiRole = 'BUYER' | 'SELLER';
export type ApiUser = { id: string; phone: string; name: string | null; role: ApiRole; lang: 'ru' | 'en' | 'uz'; verified: boolean; createdAt: string };
export type ApiSeller = { id: string; name: string | null; verified: boolean; createdAt: string; phoneMasked: string };
export type ApiListing = {
  id: string;
  eventId: string | null;
  title: string;
  city: string;
  description: string | null;
  coverUrl: string | null;
  qty: number;
  qtyAvailable: number;
  price: number;
  delivery: 'DELIVERY' | 'PICKUP';
  status: 'ACTIVE' | 'SOLD' | 'REJECTED' | 'ARCHIVED';
  views: number;
  createdAt: string;
  seller: ApiSeller;
};
export type ApiRequest = {
  id: string;
  number: number;
  listingId: string;
  name: string;
  phone: string;
  qty: number;
  subtotal: number;
  fee: number;
  total: number;
  status: 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  createdAt: string;
  listing: { id: string; eventId: string | null; title: string };
};
export type ListingInput = {
  eventId?: string;
  title: string;
  city: string;
  description?: string; // пустая строка при редактировании стирает описание
  qty: number;
  price: number;
  delivery: 'DELIVERY' | 'PICKUP';
};

// Фото билета уходит файлом "proof" в multipart/form-data.
function listingForm(fields: Partial<ListingInput>, proofUri?: string) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => v !== undefined && fd.append(k, String(v)));
  if (proofUri) {
    const name = proofUri.split('/').pop() || 'proof.jpg';
    const ext = name.split('.').pop()?.toLowerCase();
    const type = ext === 'png' ? 'image/png' : ext === 'heic' ? 'image/heic' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    fd.append('proof', { uri: proofUri, name, type } as unknown as Blob);
  }
  return fd;
}

export const api = {
  register: (name: string, phone: string, password: string, role: ApiRole) =>
    request<{ token: string; user: ApiUser }>('POST', '/auth/register', { name, phone, password, role }),
  login: (phone: string, password: string) => request<{ token: string; user: ApiUser }>('POST', '/auth/login', { phone, password }),
  me: () => request<ApiUser>('GET', '/me'),
  deleteMe: () => request<void>('DELETE', '/me'),
  updateMe: (patch: Partial<Pick<ApiUser, 'name' | 'role' | 'lang'>>) => request<ApiUser>('PATCH', '/me', patch),

  feed: (city: string) => request<{ items: ApiListing[]; total: number }>('GET', `/listings?city=${encodeURIComponent(city)}&limit=50`),
  listing: (id: string) => request<ApiListing>('GET', `/listings/${id}`),
  myListings: () => request<ApiListing[]>('GET', '/me/listings'),
  createListing: (fields: ListingInput, proofUri: string) => request<ApiListing>('POST', '/listings', listingForm(fields, proofUri)),
  updateListing: (id: string, fields: Partial<ListingInput>, proofUri?: string) =>
    request<ApiListing>('PATCH', `/listings/${id}`, proofUri ? listingForm(fields, proofUri) : fields),
  markSold: (id: string) => request<void>('POST', `/listings/${id}/sold`),
  archiveListing: (id: string) => request<void>('DELETE', `/listings/${id}`),

  favorites: () => request<ApiListing[]>('GET', '/me/favorites'),
  addFavorite: (id: string) => request<void>('PUT', `/favorites/${id}`),
  removeFavorite: (id: string) => request<void>('DELETE', `/favorites/${id}`),

  sendRequest: (body: { listingId: string; qty: number; name: string; phone: string }) => request<ApiRequest>('POST', '/requests', body),
  myRequests: () => request<ApiRequest[]>('GET', '/me/requests'),
};
