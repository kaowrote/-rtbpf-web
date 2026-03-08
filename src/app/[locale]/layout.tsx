import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexThai = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-ibm-plex-thai",
  display: "swap",
});

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { prisma } from "@/lib/prisma";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export async function generateMetadata() {
  const settings = await prisma.systemSetting.findMany({
    where: {
      key: { in: ["siteTitle", "siteDescription"] }
    }
  });

  const settingsMap = settings.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return {
    title: settingsMap["siteTitle"] || "RTBPF | Radio and Television Broadcasting Professional Federation",
    description: settingsMap["siteDescription"] || "Official Website of the Radio and Television Broadcasting Professional Federation (RTBPF). Home of the Nataraj Awards.",
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  // Fetch Branding Settings
  const settings = await prisma.systemSetting.findMany({
    where: {
      key: { in: ["primaryAccentColor", "siteTitle"] }
    }
  });
  
  const settingsMap = settings.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  const accentColor = settingsMap["primaryAccentColor"] || "#C9A84C";
  const siteName = settingsMap["siteTitle"] || undefined;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${ibmPlexThai.variable} font-sans antialiased bg-background min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --accent: ${accentColor};
            --accent-foreground: 210 40% 98%;
          }
          .text-accent { color: var(--accent) !important; }
          .bg-accent { background-color: var(--accent) !important; }
          .border-accent { border-color: var(--accent) !important; }
        ` }} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Navbar siteName={siteName} />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
