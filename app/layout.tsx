import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "OpenAI Competitor Intelligence Agent",
  description:
    "Daily competitor intelligence pipeline for OpenAI using the OpenAI Agents SDK, Vercel cron, and per-agent evals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${cormorant.variable} ${ibmPlexMono.variable}`}>{children}</body>
    </html>
  );
}
