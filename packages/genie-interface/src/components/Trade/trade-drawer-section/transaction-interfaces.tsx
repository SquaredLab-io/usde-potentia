import Image from "next/image";
import SpinnerIcon from "@components/icons/SpinnerIcon";

const TransactionError = () => (
  <div className="py-60 flex flex-col items-center justify-center gap-2 text-center">
    <Image
      src="/icons/ErrorIcon.svg"
      height={44}
      width={44}
      alt="Opening position error"
    />
    <h3 className="text-[##FB3836] text-semibold text-base/[26px] mt-3">Trade failed</h3>
    <p className="font-normal text-sm/5 text-[#979797] max-w-64">
      There was a system error, Liquidity was not added
    </p>
  </div>
);

const TransactionLoading = ({ title }: { title: string }) => (
  <div className="py-60 flex flex-col items-center justify-center gap-2 text-center">
    <SpinnerIcon stroke="#F7931A" height={44} width={44} />
    <h3 className="text-[#F7931A] text-semibold text-base/[26px] mt-3">{title}...</h3>
    <p className="font-normal text-sm/5 text-[#979797] max-w-64">
      Executing your trade, this will take less than 30 seconds
    </p>
  </div>
);

const TransactionSuccess = () => (
  <div className="py-60 flex flex-col items-center justify-center gap-2 text-center">
    <Image
      src="/icons/toast-success.svg"
      height={44}
      width={44}
      alt="Position successfully closed"
    />
    <h3 className="text-[#07AD3B] text-semibold text-base/[26px] mt-3">
      Trade Executed Successfully
    </h3>
    <p className="font-normal text-sm/5 text-[#979797] max-w-64">
      Trade was executed successfully, please check the transactions
    </p>
  </div>
);

export { TransactionSuccess, TransactionError, TransactionLoading };
