import type { Metadata } from "next";
import "./globals.css";
import { VetProvider } from "@/context/VetContext";

export const metadata: Metadata = {
  title: "VetHospital OS // Triage & Surgery Tracker",
  description: "Veterinary hospital patient triage and surgical schedule management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <VetProvider>{children}</VetProvider>
      </body>
    </html>
  );
}
