import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from '@/lib/registry'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Potato Disease Classifier",
  description: "AI-powered potato leaf disease classification",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <StyledComponentsRegistry>
      <body
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
      </StyledComponentsRegistry>
    </html>
  );
}
