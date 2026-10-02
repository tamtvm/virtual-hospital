"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import type { en } from "@frontend/locales/en.js";
import { DEFAULT_LOCALE, isSupportedLocale, translate, translateOption } from "@frontend/locales/registry.js";

type LeafPaths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : LeafPaths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = LeafPaths<typeof en>;
export type OptionGroup = "species" | "consultationTypes";

const LocaleContext = createContext<string | null>(null);

const subscribe = () => () => {};

const getClientLocale = () => {
  const { lang } = document.documentElement;
  return isSupportedLocale(lang) ? lang : DEFAULT_LOCALE;
};

const getServerLocale = () => null;

export function LocaleProvider({ children }: { children: ReactNode }) {
  const resolvedLocale = useSyncExternalStore<string | null>(subscribe, getClientLocale, getServerLocale);

  useEffect(() => {
    if (resolvedLocale) delete document.documentElement.dataset.mlvhI18nPending;
  }, [resolvedLocale]);

  return <LocaleContext value={resolvedLocale}>{children}</LocaleContext>;
}

export function useI18n() {
  const resolvedLocale = useContext(LocaleContext);
  const locale = resolvedLocale ?? DEFAULT_LOCALE;

  return {
    locale,
    isResolved: resolvedLocale !== null,
    t: (key: MessageKey, values?: Record<string, string | number>): string => translate(locale, key, values),
    optionLabel: (group: OptionGroup, value: string): string => translateOption(locale, group, value),
  };
}