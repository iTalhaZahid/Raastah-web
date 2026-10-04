import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./marketing.css";



const metropolis = localFont({
  src: [
    {
      path: "./fonts/Metropolis/Metropolis-ExtraBold.woff",
      weight: "900",
    },
    {
      path: "./fonts/Metropolis/Metropolis-Bold.woff",
      weight: "700",
    },
    {
      path: "./fonts/Metropolis/Metropolis-Medium.woff",
      weight: "500",
    },
    {
      path: "./fonts/Metropolis/Metropolis-Regular.woff",
      weight: "400",
    },
  ],
  variable: "--font-metropolis",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://raastah.app"),
  title: "Raastah | Your Campus. Your People. Your Raastah.",
  description: "Share rides with verified students going your way. Find, offer, and schedule campus rides with Raastah, the student ride-sharing app.",
  applicationName: "Raastah",
  icons: { icon: "/icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${metropolis.variable} h-full antialiased`}
    >
      <body className={`${metropolis.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
