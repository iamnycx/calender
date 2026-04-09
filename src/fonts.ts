import localFont from "next/font/local";

export const gambarino = localFont({
  src: "../public/fonts/Gambarino-Regular.woff2",
  display: "swap",
});

export const kalam = localFont({
  src: "../public/fonts/Kalam-Variable.woff2",
  display: "swap",
  variable: "--font-kalam-local",
});

export const britney = localFont({
  src: "../public/fonts/Britney-Variable.woff2",
  display: "swap",
  variable: "--font-britney-local",
});
