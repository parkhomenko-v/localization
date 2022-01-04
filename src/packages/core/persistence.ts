import {STORAGE_KEY} from './constants';

export function save(lng: string): void {
  localStorage.setItem(STORAGE_KEY, lng);
}

export function remove(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function load(): string | null {
  return localStorage.getItem(STORAGE_KEY) || null;
}
