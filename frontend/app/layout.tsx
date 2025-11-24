import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import Navbar from "@/components/Navbar";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "AetherTech | Descubre el Futuro",
  description: "Innovación, rendimiento y diseño minimalista. Explora la tecnología de vanguardia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} antialiased bg-background text-foreground font-sans`}
      >
        <NotificationProvider>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

