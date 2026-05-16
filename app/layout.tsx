import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Task Manager",
  description: "A premium full-stack task manager for teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
