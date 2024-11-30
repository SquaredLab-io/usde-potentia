"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { usePools } from "@lib/hooks/usePools";
import PoolOverview from "@components/PoolOverview";
import MobileInfoScreen from "@components/common/MobileInfoScreen";
import { useWindowSize } from "usehooks-ts";
import Loading from "@app/loading";
import NotFoundCommon from "@components/common/not-found-common";

export default function Overview() {
  const { width } = useWindowSize();
  const { pools, isFetching, status } = usePools();

  const { id } = useParams();
  const queryParams = useSearchParams();
  const power = queryParams.get("power");
  const _id = Array.isArray(id) ? id[0] : id;

  // finding the pool based on id in url
  const overviewPool = useMemo(() => {
    if (status === "success" && pools) {
      return pools.find(
        (pool) =>
          pool.underlying.toLowerCase() === _id.toLowerCase() &&
          pool.power === parseInt(power!)
      );
    }
  }, [id, pools, power, status]);

  const PoolContent = () => {
    // Show loading state while fetching
    if (status === "pending" || isFetching) {
      return <Loading />;
    }

    // If there's an error fetching pools
    if (status === "error") {
      return (
        <NotFoundCommon
          title="404 Pools not found"
          subText="Sorry, but unable to find any pools"
        />
      );
    }

    // Not fetching pools anymore, but didn't find the pool for overview
    if (status === "success" && !overviewPool) {
      return (
        <NotFoundCommon
          title={`404 ${_id.toUpperCase()} Pool not found`}
          subText="Sorry, but the pool you were looking for could not be found"
        />
      );
    }

    return (
      <main className="page-center">
        <PoolOverview overviewPool={overviewPool!} />
      </main>
    );
  };

  const render = useMemo(() => {
    return width <= 1024 ? MobileInfoScreen : <PoolContent />;
  }, [width, overviewPool, status]);

  return render;
}
