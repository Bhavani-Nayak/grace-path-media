"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DownloadsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/ebooks");
  }, [router]);

  return null;
}

