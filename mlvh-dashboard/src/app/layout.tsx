import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import DocumentTitle from "@/components/layout/DocumentTitle";
import { LocaleProvider } from "@/lib/i18n";
import { LOCALE_BOOT_SCRIPT } from "@/lib/localeBoot";
import { DEFAULT_LOCALE, translate } from "@frontend/locales/registry.js";
import { brandTitle } from "@frontend/constants/brand.js";
import "./globals.css";

const title = brandTitle(translate(DEFAULT_LOCALE, "routes.dashboard.title"));
const description = translate(DEFAULT_LOCALE, "routes.dashboard.description");

export const metadata: Metadata = {
  metadataBase: new URL("https://virtual-hospital.pages.dev"),
  description,
  alternates: { canonical: "/dashboard/" },
  openGraph: {
    type: "website",
    siteName: "My Little Virtual Hospital",
    locale: "en_US",
    title,
    description,
    url: "/dashboard/",
    images: [{ url: "/assets/brand/og-image.png", width: 1200, height: 630, alt: "My Little Virtual Hospital" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOCALE_BOOT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <LocaleProvider>
          <DocumentTitle />
          <AppShell>{children}</AppShell>
        </LocaleProvider>
      </body>
    </html>
  );
}