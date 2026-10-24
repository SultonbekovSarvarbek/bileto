import ru, { Dict } from './ru';
import en from './en';
import uz from './uz';

export type Lang = 'ru' | 'en' | 'uz';
export type { Dict };

export const DEFAULT_LANG: Lang = 'ru';
export const DICTS: Record<Lang, Dict> = { ru, en, uz };
export const LANGS = (Object.keys(DICTS) as Lang[]).map((id) => ({ id, name: DICTS[id].langName }));

// Текущий язык для кода вне React (форматирование дат/цен, Alert). Выставляет StoreProvider.
let current: Lang = DEFAULT_LANG;
export const setCurrentLang = (l: Lang) => { current = l; };
export const tr = () => DICTS[current];
