import "@/app/styles/globals.css";
import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { incognito } from "./assets/font/font";
import { gitlabmono } from "./assets/font/font";
import Navbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
import { Providers } from "./providers";
import { constant_data } from "@/constants";
import NextTopLoader from "nextjs-toploader";
import Layout from "./components/global/Layout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter",
});

const options = {
  title: "Muhammad Yazid Akbar | Software Developer",
  description:
    "Muhammad Yazid Akbar is a Software Developer and Technical Writer who is passionate about building solutions and contributing to open source communities",
  url: constant_data.base_url_fe,
  ogImage:
    "https://res.cloudinary.com/victoreke/image/upload/v1692635746/victoreke/og.png",
};

export const metadata: Metadata = {
  title: options.title,
  metadataBase: new URL(options.url),
  description: options.description,
  openGraph: {
    title: options.title,
    url: options.url,
    siteName: "victoreke.com",
    locale: "en-US",
    type: "website",
    description: options.description,
    images: options.ogImage,
  },
  alternates: {
    canonical: options.url,
  },
  other: {
    "google-site-verification": "IzcWMgn5Qjf-LCtA337KTGjivsf9bmod_1pZ-jxYQh8",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${incognito.variable} ${inter.className} ${gitlabmono.variable} dark:bg-zinc-900 bg-white dark:text-white text-zinc-700`}
      >
        <NextTopLoader
          color="#0cce6b"
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}
          crawl={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #0cce6b,0 0 5px #0cce6b"
          template={`<div class="bar" role="bar"><div class="peg"></div></div> 
          <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>`}
          zIndex={1600}
          showAtBottom={false}
        />

        <Providers>
          <Layout>
            <Navbar />
            {children}
            <Footer />
          </Layout>
        </Providers>
      </body>
      <Script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      />
    </html>
  );
}
