import { darkTheme, Theme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";

export const theme: Theme = merge(darkTheme(), {
  colors: {
    accentColor: "#01A1FF",
    accentColorForeground: "#FFFFFF",
    connectButtonBackground: "#0C1820",
    connectButtonText: "#FFFFFF",
    modalBackground: "#16191F",
    modalText: "#FFFFFF",
    modalTextSecondary: "#A0A0A0",
    modalBorder: "#2A2C30"
  },
  fonts: {
    body: 'helvetica-neue, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  },
  radii: {
    connectButton: "4px",
    modal: "8px",
    modalMobile: "8px"
  },
  // borderRadius: "small",
  blurs: {
    modalOverlay: "small"
  }
});
