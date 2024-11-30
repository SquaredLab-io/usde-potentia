"use client";

import Image from "next/image";
import ButtonCTA from "@components/common/button-cta";
import { useRouter } from "next/navigation";

interface Props {
  title: string;
  subText: string;
  callback?: () => void;
}

export default function NotFoundCommon({ title, subText, callback }: Props) {
  const router = useRouter();
  return (
    <main className="page-center flex flex-col items-center justify-center font-sans-manrope">
      <div className="w-3/4 max-w-[955px] flex flex-row justify-between">
        <div className="flex flex-col items-start gap-y-4 max-w-[397px]">
          <h1 className="font-semibold text-5xl/[60px]">{title}</h1>
          <p className="font-normal text-lg/[26px] text-base-gray">{subText}</p>
          <ButtonCTA
            onClick={() => {
              if (!callback) {
                router.refresh();
              } else {
                callback();
              }
            }}
            className="mt-5 px-14 rounded-lg"
          >
            Try Again
          </ButtonCTA>
        </div>
        <Image
          src="/icons/not-found-icon.svg"
          alt="not found - error 404"
          width={202}
          height={160}
          priority
        />
      </div>
    </main>
  );
}
