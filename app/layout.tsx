import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@fontsource/lexend-deca";
import { Open_Sans } from 'next/font/google'

export const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
})

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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

import { ConfigProvider } from 'antd';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#9d1c1f',
        },
      }}
    >
      <html lang="en">
        <body className={`${openSans.variable} antialiased`}>{children}</body>
      </html>
    </ConfigProvider>
  );
}