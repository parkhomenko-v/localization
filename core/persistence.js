import {STORAGE_KEY} from "./constants.js";

export function save(lng) {
  localStorage.setItem(STORAGE_KEY, lng);
}

export function remove() {
  localStorage.removeItem(STORAGE_KEY);
}

export function load() {
  return localStorage.getItem(STORAGE_KEY) || null;
}
