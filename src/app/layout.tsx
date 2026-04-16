import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prompt Forge -- AI Image Prompt Generator",
  description: "Generate high-quality random prompts for Stable Diffusion, SDXL, Pony, Illustrious, Chroma, Z-Image, and more. Supports companion mode and full character customization.",
  keywords: [
    "AI prompt generator",
    "Stable Diffusion",
    "SDXL",
    "Pony Diffusion",
    "Illustrious",
    "FluxPony",
    "Chroma",
    "image generation",
    "prompt engineering",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
