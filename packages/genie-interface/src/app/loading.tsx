"use client";

import dynamic from "next/dynamic";

const LoadingLogo = dynamic(
  () => import("@components/icons/loading-logo"),
  { ssr: false } // This component will only render on client-side
);

const Loading = () => (
  <main className="page-center size-full flex-col-center gap-5 font-sans-ibm-plex border-t border-secondary-gray">
    <LoadingLogo />
  </main>
);

export default Loading;
