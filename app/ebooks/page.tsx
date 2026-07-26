"use client";

import { useEbookCatalogViewModel } from "@/viewmodels/useEbookCatalogViewModel";
import EbookCatalogView from "@/components/views/EbookCatalogView";

export default function EbooksPage() {
  const vm = useEbookCatalogViewModel();
  return <EbookCatalogView {...vm} />;
}
