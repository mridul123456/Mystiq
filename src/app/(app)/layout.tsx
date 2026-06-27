import type { Metadata } from "next";
import { cn } from "@/lib/utils";
    import '../globals.css'
import Navbar from "@/components/Navbar";


export const metadata: Metadata = {
  title: "Mystiq",
  description: "Anonymous Message App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html
    //   lang="en"
    //   className={cn("h-full", "antialiased", "font-sans")}
    // >
    //     <body className="min-h-full flex flex-col">
    //       <Navbar />
    //       {children}
    //     </body>
    // </html>
    <>
      <Navbar />
      {children}
    </>
  );
}
