import type { Metadata } from "next";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: PageMetadata): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Raastah",
      locale: "en_PK",
      type: "website",
      images: [{ url: "/icon.png", width: 512, height: 512, alt: "Raastah" }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/icon.png"],
    },
  };
}
