import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodLogic — Food Science Mentorship",
  description:
    "A mentorship platform for food science, dairy technology, and chemical engineering professionals and students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
