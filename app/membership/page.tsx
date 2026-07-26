"use client";

import { useMembershipViewModel } from "@/viewmodels/useMembershipViewModel";
import MembershipView from "@/components/views/MembershipView";

export default function MembershipPage() {
  const vm = useMembershipViewModel();
  return <MembershipView {...vm} />;
}
