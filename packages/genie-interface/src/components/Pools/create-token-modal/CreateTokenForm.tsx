import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@components/ui/input";
import { CreateTokenFormSchema, formSchema } from "./createTokenFormSchema";
import { cn } from "@lib/utils";
import ButtonCTA from "@components/common/button-cta";

interface BoxInfo {
  title: string;
  children: ReactNode;
  description?: string;
}

const BoxInfo = ({ title, description, children }: BoxInfo) => (
  <div className="flex flex-row items-start justify-between">
    <div className="flex flex-col gap-y-2 w-1/2 max-w-[282px] float-left">
      <h4 className="font-medium text-lg/[18px]">{title}</h4>
      {description && <p className="text-sm/5 text-[#94A3B8]">{description}</p>}
    </div>
    <div className="w-1/2 float-right">{children}</div>
  </div>
);

const CreateTokenForm = () => {
  const form = useForm<CreateTokenFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: "",
      tokenSymbol: ""
    },
    mode: "onChange"
  });

  function onSubmit(values: CreateTokenFormSchema) {
    console.log("create token form", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full mb-6">
        {/* Basic Token Configs */}
        <div className="p-6 flex flex-col gap-10 w-full">
          {/* Token Name */}
          <BoxInfo
            title="Token Name"
            description="Name your token for easy identification"
          >
            <FormField
              control={form.control}
              name="tokenName"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input
                        placeholder="Eg. Degencoin"
                        value={field.value}
                        onChange={(e) => {
                          return field.onChange(e.target.value);
                        }}
                        type="text"
                        className={cn(
                          "p-4 bg-transparent mb-4 rounded-lg",
                          errors.tokenName && "border-[#FF3318]"
                        )}
                      />
                      <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          </BoxInfo>
          {/* Token Symbol */}
          <BoxInfo
            title="Token Symbol"
            description="Choose a memorable ticker for your token"
          >
            <FormField
              control={form.control}
              name="tokenSymbol"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input
                        placeholder="Eg. DEGEN"
                        value={field.value}
                        onChange={(e) => {
                          return field.onChange(e.target.value);
                        }}
                        type="text"
                        className={cn(
                          "p-4 bg-transparent mb-4 rounded-lg",
                          errors.tokenName && "border-[#FF3318]"
                        )}
                      />
                      <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          </BoxInfo>
          <div className="w-full flex flex-col gap-y-10 items-end mt-10">
            <div className="w-1/2 float-right flex flex-col items-end gap-y-2 font-sans-manrope text-[#94A3B8]">
              <p>
                You&apos;ll Receive: <span className="font-bold text-white">100,000</span>
              </p>
              <p>
                Faucet Allocation: <span className="font-bold text-white">900,000</span>
              </p>
              <p className="mt-2">
                Total Supply: <span className="font-bold text-white">1,000,000</span>
              </p>
            </div>
            <ButtonCTA
              className="w-1/2 rounded-lg float-right"
              disabled={!(form.formState.isValid && form.formState.isDirty)}
            >
              Create Token
            </ButtonCTA>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CreateTokenForm;
