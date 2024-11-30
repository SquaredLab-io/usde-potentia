"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PoolOverviewPage() {
  const router = useRouter();

  // Forward to WETH^2 page as default pool
  useEffect(() => router.push("/pool/weth?power=2"), []);

  return <main></main>;
}
