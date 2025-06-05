import "./globals.css";
import { ReactNode } from "react";
import { Orbitron } from "next/font/google";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import Head from "next/head";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-orbitron",
});

export const metadata = {
  title: "FlipSip - Flip It, Sip It",
  description:
    "Neon H₂O for Gen Z and Gen Alpha—because why should only AI evolve?",
  openGraph: {
    title: "FlipSip - Flip It, Sip It",
    description:
      "Neon H₂O for Gen Z and Gen Alpha—because why should only AI evolve?",
    url: "https://flipsip.vercel.app/",
    images: ["https://flipsip.vercel.app/images/logo.png"], // Replace with your actual OG image URL
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlipSip - Flip It, Sip It",
    description:
      "Neon H₂O for Gen Z and Gen Alpha—because why should only AI evolve?",
    images: ["https://flipsip.vercel.app/images/logo.png"],
  },
  alternates: {
    canonical: "https://flipsip.vercel.app/",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ff" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* Futuristic preconnects & fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap"
          rel="stylesheet"
        />
        {/* Structured Data for Product/Brand */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Brand",
              name: "FlipSip",
              url: "https://flipsip.vercel.app/",
              logo: "https://flipsip.vercel.app/images/logo.png",
              slogan: "Flip It, Sip It",
              description:
                "Neon H₂O for Gen Z and Gen Alpha—because why should only AI evolve?",
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/InStock",
                priceCurrency: "INR",
              },
            }),
          }}
        />
      </Head>
      <body
        className={`${orbitron.variable} font-futuristic min-h-screen bg-blackish text-white`}
      >
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
