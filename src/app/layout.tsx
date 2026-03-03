import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uranium Company - Hub de Apresentações Comerciais",
  description: "Sistema de gerenciamento de apresentações comerciais da Uranium Company. Crie, edite e compartilhe apresentações incríveis.",
  keywords: ["Uranium Company", "Apresentações", "Comercial", "Propostas", "Next.js"],
  authors: [{ name: "Uranium Company" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Uranium Company - Hub de Apresentações",
    description: "Gerenciamento de apresentações comerciais",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
