import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/context/Theme";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/context/AuthProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const iceland = localFont({
  src: "../public/fonts/iceland.ttf",
  variable: "--font-iceland",
  weight: "100 200 300 400 500 600 700 800 800 900",
});

const frans = localFont({
  src: "../public/fonts/frans.ttf",
  variable: "--font-frans",
  weight: "100 200 300 400 500 600 700 800 800 900",
});

const asap = localFont({
  src: "../public/fonts/asap.ttf",
  variable: "--font-asap",
  weight: "100 200 300 400 500 600 700 800 800 900",
});

export const metadata = {
  title: "GYMFIT",
  description: "Live Healthy and make Environment Healthy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        iceland.variable,
        frans.variable,
        asap.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
