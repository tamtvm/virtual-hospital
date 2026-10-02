"use client";

import { brandTitle } from "@frontend/constants/brand.js";
import { useI18n } from "@/lib/i18n";

export default function DocumentTitle() {
  const { t, isResolved } = useI18n();

  return <title>{brandTitle(isResolved ? t("routes.dashboard.title") : "")}</title>;
}