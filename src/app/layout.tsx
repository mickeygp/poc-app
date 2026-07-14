import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enterprise Portal",
  description: "Single sign-on portal for workplace apps",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
