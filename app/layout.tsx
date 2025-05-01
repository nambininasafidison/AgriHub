import { AuthProvider } from "@/components/auth/auth-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { WishlistProvider } from "@/components/wishlist/wishlist-provider";
import { Inter } from "next/font/google";
import type React from "react";
import { SWRConfig } from "swr";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AgriCommerce Hub",
  description: "A comprehensive e-commerce platform for agricultural products",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NotificationProvider>
              <WishlistProvider>
                <SWRConfig
                  value={{
                    fetcher: async (resource, init) => {
                      const response = await fetch(resource, init);
                      if (!response.ok) {
                        throw new Error(
                          "An error occurred while fetching data."
                        );
                      }
                      return response.json();
                    },
                    onError: (error) => {
                      console.error("SWR Error:", error);
                    },
                    revalidateOnFocus: true,
                    dedupingInterval: 2000,
                  }}
                >
                  {children}
                </SWRConfig>
                <Toaster />
              </WishlistProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
