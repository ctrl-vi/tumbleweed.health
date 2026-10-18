import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer, s } from "@/components/site";
export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/brand/favicon.png", type: "image/png", sizes: "64x64" }],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  title: {
    default: "Tumbleweed — A useful next step",
    template: "%s | Tumbleweed",
  },
  description:
    "Find local food resources, ideas for meals, and help understanding food programs. Start with a text.",
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
