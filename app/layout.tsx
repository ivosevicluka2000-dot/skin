import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CommerceProvider } from "@/components/commerce-store";
import { LearningProvider } from "@/components/learning-store";
import { MemberProvider } from "@/components/member-store";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  const origin = "https://equa-skin-lab.ivosevicluka2000.chatgpt.site";
  const socialImage = `${origin}/og.png`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "EQUA — pametnija nega kože",
      template: "%s — EQUA",
    },
    description:
      "Video programi, Skin Blueprint, stručni vodiči, zajednica i pažljivo odabrana nega kože — povezani u jedno iskustvo.",
    openGraph: {
      type: "website",
      locale: "sr_RS",
      siteName: "EQUA",
      title: "EQUA — pametnija nega kože",
      description: "Razumi kožu, nauči rutinu i kupuj proizvode u pravom kontekstu.",
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
          <MemberProvider>
            <LearningProvider>
              <SiteShell>{children}</SiteShell>
            </LearningProvider>
          </MemberProvider>
        </CommerceProvider>
      </body>
    </html>
  );
}
