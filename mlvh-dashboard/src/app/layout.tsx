import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://virtual-hospital.pages.dev"),
  title: "˚₊‧꒰ა dashboard, mlvh ໒꒱ ‧₊˚",
  description: "Live clinical analytics for My Little Virtual Hospital: admissions per week, patients by species and consultations by type.",
  alternates: { canonical: "/dashboard/" },
  openGraph: {
    type: "website",
    siteName: "My Little Virtual Hospital",
    locale: "en_US",
    title: "˚₊‧꒰ა dashboard, mlvh ໒꒱ ‧₊˚",
    description: "Live clinical analytics for My Little Virtual Hospital: admissions per week, patients by species and consultations by type.",
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
    <html lang="en">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}