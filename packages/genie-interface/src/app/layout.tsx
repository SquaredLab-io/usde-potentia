import { Suspense } from "react";
import { Metadata } from "next";
import { ibm_plex_sans, helvetica_neue, manrope } from "@lib/fonts";
import { cn } from "@lib/utils";
import Header from "@components/common/Header";
import { meta } from "@lib/constants";
import Providers from "@components/common/providers";
import { Toaster } from "@components/ui/sonner";
import Loading from "./loading";
import "./globals.css";

const {
  DOMAIN,
  APP_NAME,
  DESCRIPTION,
  KEYWORDS,
  APP_URL,
  LOGO,
  IMAGE,
  SITE_NAME,
  USERNAME
} = meta;

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [
    {
      name: "SquaredLabs",
      url: DOMAIN
    }
  ],
  creator: "SquaredLabs",
  publisher: "SquaredLabs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  icons: {
    icon: LOGO,
    apple: "apple-touch-icon-precomposed"
  },
  applicationName: APP_NAME,
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: APP_NAME,
    description: DESCRIPTION,
    url: APP_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "https://frontend-web-resources.s3.amazonaws.com/genie-og-small.webp",
        width: 800,
        height: 600,
        alt: `${APP_NAME} Preview`,
        type: "image/webp"
      },
      {
        url: "https://frontend-web-resources.s3.amazonaws.com/genie-og-small.png",
        width: 800,
        height: 600,
        alt: `${APP_NAME} Preview`,
        type: "image/png"
      },
      {
        url: "https://frontend-web-resources.s3.amazonaws.com/genie-og-large.webp",
        width: 1800,
        height: 1600,
        alt: `${APP_NAME} Preview`,
        type: "image/webp"
      },
      {
        url: "https://frontend-web-resources.s3.amazonaws.com/genie-og-large.png",
        width: 1800,
        height: 1600,
        alt: `${APP_NAME} Preview`,
        type: "image/png"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      nocache: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  twitter: {
    title: APP_NAME,
    description: DESCRIPTION,
    images: [IMAGE],
    card: "summary_large_image",
    creator: USERNAME,
    site: USERNAME
  },
  category: "DeFi"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(ibm_plex_sans.variable, helvetica_neue.variable, manrope.variable)}
      >
        <Providers>
          <Header />
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Providers>
        <Toaster
          position="bottom-right"
          expand
          visibleToasts={4}
          offset={"28px"}
          toastOptions={{
            unstyled: true,
            className: "min-w-[345px] rounded-sm backdrop-blur-md bg-[#161A1C17]/5"
          }}
        />
      </body>
    </html>
  );
}
