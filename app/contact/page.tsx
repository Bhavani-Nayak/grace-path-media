"use client";

import { useContactViewModel } from "@/viewmodels/useContactViewModel";
import ContactView from "@/components/views/ContactView";

export default function ContactPage() {
  const vm = useContactViewModel();
  return <ContactView {...vm} />;
}
