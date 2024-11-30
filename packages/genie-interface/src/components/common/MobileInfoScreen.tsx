import Image from "next/image";

const MobileInfoScreen: React.ReactNode = (
  <main className="page-center items-center justify-center gap-3">
    <div className="-mt-10 flex flex-col items-center text-center max-w-[267px]">
      <Image
        src="/icons/mobile-to-desktop.svg"
        alt="mobile-to-desktop"
        width={91.63}
        height={65}
      />
      <h2 className="mt-5 font-semibold text-base/[26px]">Your screen is too small</h2>
      <h4 className="mt-2 font-normal text-sm/5 text-[#979797]">
        Please access GenieDex from a desktop device
      </h4>
    </div>
  </main>
);

export default MobileInfoScreen;
