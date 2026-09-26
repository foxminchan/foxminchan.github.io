import { atom } from 'jotai';

// Persistent Dark Mode state (safely reads and synchronizes with localStorage)
const getInitialTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('portfolio_theme');
    if (saved) return saved === 'dark';
  }
  return true;
};

const baseDarkModeAtom = atom<boolean>(getInitialTheme());

export const darkModeAtom = atom(
  get => get(baseDarkModeAtom),
  (get, set, update: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof update === 'function' ? update(get(baseDarkModeAtom)) : update;
    set(baseDarkModeAtom, nextVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_theme', nextVal ? 'dark' : 'light');
      if (nextVal) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
);

// Global Modals State
export const shareModalOpenAtom = atom<boolean>(false);
export const shortcutsModalOpenAtom = atom<boolean>(false);

// Shortcut HUD Toast State
export interface ShortcutToastState {
  message: string;
  keyHint?: string;
}

export const shortcutToastAtom = atom<ShortcutToastState | null>(null);
