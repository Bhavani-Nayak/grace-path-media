"use client";

import { useDownloadsViewModel } from "@/viewmodels/useDownloadsViewModel";
import { useAuthViewModel } from "@/viewmodels/useAuthViewModel";
import DownloadsView from "@/components/views/DownloadsView";

export default function DownloadsPage() {
  const downloadsVm = useDownloadsViewModel();
  const authVm = useAuthViewModel();

  return (
    <DownloadsView
      {...downloadsVm}
      signOut={authVm.signOut}
      deleteAccount={authVm.deleteAccount}
    />
  );
}
