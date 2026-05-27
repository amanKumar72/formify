import localFont from "next/font/local";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const epilogue = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-epilogue",
  weight: "100 900",
});

const hankenGrotesk = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-hanken",
  weight: "100 900",
});

const spaceMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-space-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${epilogue.variable}
          ${hankenGrotesk.variable}
          ${spaceMono.variable}
        `}
      >
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
