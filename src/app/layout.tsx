import type { Metadata } from "next";
import AuthProvider from "@/context/AuthProvider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import './globals.css'


export const metadata: Metadata = {
  title: "Mystiq",
  description: "Welcome to the myterious Mystiq App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans")}
    >
        <body className="min-h-full flex flex-col">
          <AuthProvider>
            {/* <Navbar /> */}
            {children}
            <Toaster  />
            <Toaster richColors theme="light" />
          </AuthProvider>
        </body>
    </html>
  );
}
