import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist } from "next/font/google";
import { CommerceProvider } from "@/components/commerce-store";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const socialImage = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "EQUA — pametnija nega kože",
      template: "%s — EQUA",
    },
    description:
      "Personalizovane rutine, stručni vodiči i pažljivo odabrana nega kože — povezani u jedno iskustvo.",
    openGraph: {
      type: "website",
      locale: "sr_RS",
      siteName: "EQUA",
      title: "EQUA — pametnija nega kože",
      description: "Tvoja koža nije kategorija. Složi rutinu koja počinje kontekstom, ne trendom.",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "EQUA — Tvoja koža nije kategorija." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "EQUA — pametnija nega kože",
      description: "Tvoja koža nije kategorija.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr-Latn">
      <body className={`${geistSans.variable} antialiased`}>
        <CommerceProvider>
          <SiteShell>{children}</SiteShell>
        </CommerceProvider>
      </body>
    </html>
  );
}
