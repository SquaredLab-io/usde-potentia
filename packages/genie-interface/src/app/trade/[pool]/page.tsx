"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useWindowSize } from "usehooks-ts";
import { usePools } from "@lib/hooks/usePools";
import NotFoundCommon from "@components/common/not-found-common";
import Loading from "@app/loading";
import { usePoolsStore } from "@store/poolsStore";
import Trade from "@components/Trade";

/**
 * Trade Interface - Currently set as the Homepage of Genie
 */
export default function TradePage() {
  const { width } = useWindowSize();
  const { pools, isFetching, status } = usePools();
  const { updateSelectedPool } = usePoolsStore();

  const { pool } = useParams();
  const poolSymbol = Array.isArray(pool) ? pool[0] : pool;
  const [underlying, power] = poolSymbol.split("-");

  // finding the pool based on symbol and power in url
  const currentPool = useMemo(() => {
    if (status === "success" && pools) {
      return pools.find(
        (pool) =>
          pool.underlying.toLowerCase() === underlying.toLowerCase() &&
          pool.power === parseInt(power!)
      );
    }
  }, [underlying, pools, power, status]);

  useEffect(() => {
    if (currentPool) {
      updateSelectedPool(currentPool);
    }
  }, [currentPool]);

  if (isFetching || status === "pending" || width === 0) return <Loading />;
  // If there's an error fetching pools
  else if (status === "error") {
    return (
      <NotFoundCommon
        title="404 Pools not found"
        subText="Sorry, but unable to find any pools"
      />
    );
  }

  // Not fetching pools anymore, but didn't find the pool for overview
  else if (status === "success" && !currentPool) {
    return (
      <NotFoundCommon
        title={`404 ${underlying.toUpperCase()} Pool not found`}
        subText="Sorry, but the pool you were looking for could not be found"
      />
    );
  }

  return (
    <main className="page-center">
      <Trade />
    </main>
  );
}
