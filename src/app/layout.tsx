import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import { MusicPlayerProvider } from "@/components/music/MusicPlayerProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Nova — a voice that actually listens",
  description:
    "Nova understands what you need, answers out loud, and gets things done. No typing required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased bg-background text-ink">
        <ThemeProvider>
          <LanguageProvider>
            <MusicPlayerProvider>{children}</MusicPlayerProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
