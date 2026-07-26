"use client";

import { useHomeViewModel } from "@/viewmodels/useHomeViewModel";
import HomeView from "@/components/views/HomeView";

export default function HomePage() {
  useHomeViewModel(); // signals mounted
  return <HomeView />;
}
