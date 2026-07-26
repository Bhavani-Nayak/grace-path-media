import AboutView from "@/components/views/AboutView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Grace Path Media — our mission, our community, and the work we do.",
};

export default function AboutPage() {
  return <AboutView />;
}
