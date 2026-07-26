import SupportView from "@/components/views/SupportView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support This Project",
  description: "Support Grace Path Media — help us keep creating honest, reflective content.",
};

export default function SupportPage() {
  return <SupportView />;
}
