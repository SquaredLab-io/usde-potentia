"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TradePage() {
  const router = useRouter();
  // Forward to WETH^8 page as default pool
  useEffect(() => router.push("/trade/weth-8"), []);
  return <></>;
}
