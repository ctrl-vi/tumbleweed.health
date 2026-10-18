import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer, s } from "@/components/site";
const title = "Find Food Easily with a SMS/Voice-based Chatbot | Tumbleweed";
const description =
  "Tumbleweed. A SMS/Voice-based chatbot that connects people in food deserts to nearby food resources, assistance programs, and community events, with no app, browser, or fast internet required.";
const shareImage = {
  url: "/brand/tumbleweed-share.png",
  width: 1200,
  height: 630,
  alt: "A Tumbleweed SMS conversation in a phone mockup on a warm sand background",
};
export const metadata: Metadata = {
  metadataBase: new URL("https://www.tumbleweed.health"),
  applicationName: "Tumbleweed",
  openGraph: {
    type: "website",
    siteName: "Tumbleweed",
    title,
    description,
    locale: "en_US",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImage],
  },
  icons: {
    icon: [{ url: "/brand/favicon.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  title: {
    default: title,
    template: "%s | Tumbleweed",
  },
  description,
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <div className={s.shell}>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
