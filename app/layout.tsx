import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import React, { Suspense } from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Loading from "./loading";
import Head from "next/head";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "assets/images/cofo/SVGIconSticker.svg",
    shortcut: "assets/images/cofo/SVGIconSticker.svg",
    apple: "assets/images/cofo/SVGIconSticker.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className='min-h-screen w-screen overflow-x-hidden'
    >
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0'
        />
      </Head>
      <UserProvider>
        <body className='light min-h-screen bg-background antialiased w-screen overflow-x-hidden'>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </body>
      </UserProvider>
    </html>
  );
}
