"use client";

import { useSyncExternalStore } from "react";

export type CartItem = { slug: string; qty: number };

const KEY = "ts-cart";
const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(raw)) items = raw;
  } catch {}
}

function commit(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
const getSnapshot = () => {
  load();
  return items;
};
const getServerSnapshot = () => EMPTY;

export function addToCart(slug: string, qty = 1) {
  load();
  const found = items.find((i) => i.slug === slug);
  commit(
    found
      ? items.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i))
      : [...items, { slug, qty }],
  );
}
export function setQty(slug: string, qty: number) {
  load();
  commit(
    qty <= 0
      ? items.filter((i) => i.slug !== slug)
      : items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
  );
}
export const removeFromCart = (slug: string) => setQty(slug, 0);
export const clearCart = () => commit([]);

export function useCart() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { items: list, count: list.reduce((n, i) => n + i.qty, 0) };
}
