import "./globals.css";
import { ReactNode } from "react";
import { Orbitron } from "next/font/google";
import SessionProviderWrapper from "./components/SessionProviderWrapper";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-orbitron",
});

export const metadata = {
  title: "FlipSip | Futuristic Water Bottles",
  description: "Futuristic neon water bottles for tomorrow.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} font-futuristic min-h-screen bg-blackish text-white`}
      >
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
