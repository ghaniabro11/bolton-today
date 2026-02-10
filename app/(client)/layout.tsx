import Footer from "@/components/client-components/footer";
import Navbar from "@/components/client-components/navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
// import Script from "next/script";
const InterText = Inter({
  subsets: ["cyrillic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "optional", // Reduces CLS from font swap (avoids reflow when font loads)
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg", // This will use your SVG favicon
  },
  // // Robots meta (camelCase keys)
  // robots: {
  //   index: true,
  //   follow: true,
  //   "max-snippet": -1,
  //   "max-video-preview": -1,
  //   "max-image-preview": "large",
  // },
  robots: {
    index: false,
    follow: false,
    "max-snippet": -1,
    "max-video-preview": -1,
    "max-image-preview": "large",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" your-theme="system">
      <head>

      </head>
      <body
        className={`
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar]:h-1.5
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:cursor-point
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
         ${InterText.variable}
        `}
        suppressHydrationWarning
      >
        {/* <Header /> */}
        <Navbar />
        <div className="max-w-7xl px-[3%] mx-auto ">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
