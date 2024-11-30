import Image from "next/image";
import { toast } from "sonner";
import { XIcon } from "lucide-react";
import Spinner from "@components/icons/Spinner";

interface ArgsType {
  id: string | number;
  title: string;
  description?: string;
  closable?: boolean;
  duration?: number;
}

const success = ({
  id,
  title,
  description,
  closable = true,
  duration = 5000
}: ArgsType) => {
  return toast.custom(
    (t) => (
      <div className="relative inline-flex items-start gap-3 min-w-[345px] py-5 px-3 bg-[#00081438] font-normal text-sm/4 rounded-sm">
        <Image
          src="/icons/toast-success.svg"
          alt="Success Notification"
          height={24}
          width={24}
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-[#07AE3B]">{title}</h2>
          <p className="text-white">{description}</p>
          {closable && (
            <button className="absolute top-5 right-3" onClick={() => toast.dismiss(t)}>
              <XIcon size="12" color="#FFFFFF" />
            </button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 h-3 rounded-b-sm w-full border-b border-[#07AE3B] animate-toast-progress" />
      </div>
    ),
    {
      id,
      duration
    }
  );
};

const info = ({ id, title, description, closable = true, duration = 5000 }: ArgsType) => {
  return toast.custom(
    (t) => (
      <div className="relative inline-flex items-start gap-3 font-normal text-sm/4 py-5 px-3 bg-[#161A1C17]/5 w-full">
        <Image src="/icons/toast-info.svg" alt="Information" height={24} width={24} />
        <div className="flex flex-col gap-2">
          <h2 className="text-[#F7931A]">{title}</h2>
          <p className="text-white">{description}</p>
          {closable && (
            <button className="absolute top-5 right-3" onClick={() => toast.dismiss(t)}>
              <XIcon size="12" color="#FFFFFF" />
            </button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 h-3 rounded-b-sm w-full border-b border-[#F7931A] animate-toast-progress" />
      </div>
    ),
    {
      id,
      duration
    }
  );
};

const loading = ({
  id,
  title,
  description,
  closable = false,
  duration = Infinity
}: ArgsType) => {
  return toast.custom(
    (t) => (
      <div className="relative inline-flex items-center gap-3 font-normal text-sm/4 py-5 px-3 bg-[#161A1C17]/5 border-b border-[#F7931A] w-full">
        <Spinner />
        <div className="flex flex-col gap-2">
          <h2 className="text-[#F7931A]">{title}</h2>
          <p className="text-white">{description}</p>
          {closable && (
            <button className="absolute top-5 right-3" onClick={() => toast.dismiss(t)}>
              <XIcon size="12" color="#FFFFFF" />
            </button>
          )}
        </div>
      </div>
    ),
    {
      id,
      duration
    }
  );
};

const error = ({
  id,
  title,
  description,
  closable = true,
  duration = 5000
}: ArgsType) => {
  return toast.custom(
    (t) => (
      <div className="relative inline-flex items-start gap-3 font-normal text-sm/4 py-5 px-3 w-full">
        <Image src="/icons/toast-error.svg" alt="Execution Error" height={24} width={24} />
        <div className="flex flex-col gap-2">
          <h2 className="text-[#FB3836]">{title}</h2>
          <p className="text-white">{description}</p>
          {closable && (
            <button className="absolute top-5 right-3" onClick={() => toast.dismiss(t)}>
              <XIcon size="12" color="#FFFFFF" />
            </button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 h-3 rounded-b-sm w-full border-b border-[#FB3836] animate-toast-progress" />
      </div>
    ),
    {
      id,
      duration
    }
  );
};

/**
 * @returns Notifications: Success, Info, Error, Loading
 */
const notification = {
  success,
  info,
  error,
  loading
};

export default notification;
