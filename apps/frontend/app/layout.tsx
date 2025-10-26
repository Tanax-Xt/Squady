import { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { cn } from "@/shared/lib/utils";
import { Toaster } from "@/shared/ui/sonner";

import "@/app/styles";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Squady",
  title: {
    default: "Squady",
    template: "%s · Squady",
  },
  description:
    "Веб-приложение для удобного подбора команды для совместного участия в олимпиадах, хакатонах и других проектах.",
  keywords: [
    "олимпиады",
    "хакатоны",
    "команда",
    "проекты",
    "студенты",
    "участие",
    "коллаборация",
    "образование",
    "IT мероприятия",
    "командные соревнования",
  ],
  category: "education",
  authors: [{ name: "Squady" }],
  creator: "Squady",
  publisher: "Squady",
  openGraph: {
    type: "website",
    title: "Squady",
    siteName: "Squady",
    locale: "ru_RU",
    description:
      "Веб-приложение для удобного подбора команды для совместного участия в олимпиадах, хакатонах и других проектах.",
  },
  twitter: {
    card: "summary",
    title: "Squady",
    description:
      "Веб-приложение для удобного подбора команды для совместного участия в олимпиадах, хакатонах и других проектах.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    notranslate: true,
    noimageindex: false,
  },
};

export default function AppLayout({ children }: React.PropsWithChildren) {
  return (
    <html
      lang="ru"
      className={cn(inter.variable, firaCode.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
