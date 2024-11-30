import { IBM_Plex_Sans, Manrope } from "next/font/google";
import localFont from "next/font/local";

export const ibm_plex_sans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"]
});

export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--manrope-sans",
  weight: ["400", "500", "600", "700"]
});

export const helvetica_neue = localFont({
  src: [
    {
      path: "./localfonts/helveticaneue-thin-200.woff2",
      weight: "200",
      style: "normal"
    },
    {
      path: "./localfonts/helveticaneue-light-300.woff2",
      weight: "300",
      style: "normal"
    },
    {
      path: "./localfonts/helveticaneue-400.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "./localfonts/helveticaneue-medium-500.woff2",
      weight: "500",
      style: "normal"
    },
    {
      path: "./localfonts/helveticaneue-bold-700.woff2",
      weight: "700",
      style: "normal"
    }
  ],
  display: "swap",
  variable: "--font-helvetica-neue"
});
