import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Résumé — Tirso Navarro",
  description:
    "Résumé for Tirso Navarro — Web Developer & E-Commerce Specialist based in Miami, FL.",
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
