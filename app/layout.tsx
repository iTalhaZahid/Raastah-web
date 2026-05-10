import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";



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
  title: "Raastah",
  description: "Student Ride Sharing App",
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
