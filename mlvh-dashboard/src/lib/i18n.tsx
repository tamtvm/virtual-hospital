"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import type { en } from "@locales/en.js";
import { DEFAULT_LOCALE, isSupportedLocale, translate, translateOption } from "@locales/registry.js";

type LeafPaths<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${Prefix}${K}` : LeafPaths<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type MessageKey = LeafPaths<typeof en>;
export type OptionGroup = "species" | "consultationTypes";

const LocaleContext = createContext<string>(DEFAULT_LOCALE);

const subscribe = () => () => {};

const getClientLocale = () => {
  const { lang } = document.documentElement;
  return isSupportedLocale(lang) ? lang : DEFAULT_LOCALE;
};

const getServerLocale = () => DEFAULT_LOCALE;

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getClientLocale, getServerLocale);

  useEffect(() => {
    if (locale === getClientLocale()) delete document.documentElement.dataset.mlvhI18nPending;
  }, [locale]);

  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useI18n() {
  const locale = useContext(LocaleContext);

  return {
    locale,
    t: (key: MessageKey, values?: Record<string, string | number>): string => translate(locale, key, values),
    optionLabel: (group: OptionGroup, value: string): string => translateOption(locale, group, value),
  };
}