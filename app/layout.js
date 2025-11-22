import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {TrollProvider} from "@/app/components/trollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Troller Derby!",
  description: "Crescent City Crushers Troller Derby",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <TrollProvider>
        {children}
      </TrollProvider>
      </body>
    </html>
  );
}
