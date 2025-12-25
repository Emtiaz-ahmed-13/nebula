import { Providers } from "@/components/providers"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Nebula Chat | Secure, Self-Destructing Private Conversations",
  description: "Nebula Chat is a secure, privacy-focused messaging platform where conversations automatically self-destruct after a set duration. Perfect for confidential discussions that leave no trace.",
  keywords: ["secure chat", "private messaging", "self-destructing messages", "encrypted chat", "temporary chat", "privacy-focused"],
  authors: [{ name: "Nebula Development Team" }],
  creator: "Nebula Development Team",
  publisher: "Nebula",
  icons: {
    icon: "/images.jpeg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nebula-nu-wine.vercel.app/",
    title: "Nebula Chat | Secure, Self-Destructing Private Conversations",
    description: "Nebula Chat is a secure, privacy-focused messaging platform where conversations automatically self-destruct after a set duration.",
    siteName: "Nebula Chat",
    images: [
      {
        url: "/images.jpeg",
        width: 1200,
        height: 630,
        alt: "Nebula Chat - Secure, Self-Destructing Private Conversations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nebula Chat | Secure, Self-Destructing Private Conversations",
    description: "Nebula Chat is a secure, privacy-focused messaging platform where conversations automatically self-destruct after a set duration.",
    images: ["/images.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  themeColor: "#065f46", // emerald-700
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
