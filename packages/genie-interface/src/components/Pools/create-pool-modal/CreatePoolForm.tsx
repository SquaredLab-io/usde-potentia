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
import SliderBar from "@components/common/slider-bar";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import ButtonCTA from "@components/common/button-cta";
import { CreatePoolFormSchema, formSchema } from "./createPoolformSchema";
import { cn } from "@lib/utils";

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

export default function CreatePoolForm() {
  const VAULT_ADDRESS = "0x428084313F9dCc38e9d0cB51dBBe466c8300a35c";

  const form = useForm<CreatePoolFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialLiquidity: 1,
      power: 2,
      sqlFee: 100,
      halfLife: 0,
      priceUpdateFactor: 0
    },
    mode: "onChange"
  });

  function onSubmit(values: CreatePoolFormSchema) {
    console.log("create pool form", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full mb-6">
        {/* Basic Pool Configs */}
        <div className="p-6 flex flex-col gap-20">
          {/* Underlying Tokens */}
          <BoxInfo
            title="Underlying Token"
            description="Select the network you would like to provide liquidity on."
          >
            <p>Select Token</p>
            {/* <Select>
            <SelectTrigger>
              <SelectValue>Select Token</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">x</SelectItem>
              <SelectItem value="2">x</SelectItem>
              <SelectItem value="3">x</SelectItem>
            </SelectContent>
          </Select> */}
          </BoxInfo>
          <BoxInfo
            title="Initial Liquidity"
            description="Which token pair would you like to add liquidity to."
          >
            <FormField
              control={form.control}
              name="initialLiquidity"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input
                        placeholder="0"
                        value={field.value}
                        onChange={(e) => {
                          return field.onChange(parseFloat(e.target.value));
                        }}
                        type="number"
                        className={cn(
                          "p-4 bg-transparent mb-4",
                          errors.initialLiquidity && "border-[#FF3318]"
                        )}
                      />
                      <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                      <SliderBar
                        {...field}
                        value={field.value}
                        setValue={(value) => field.onChange(value)}
                        min={1}
                        max={358}
                        step={0.001}
                        className="mt-5"
                        indices={[1, 90, 180, 269, 358]}
                      />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          </BoxInfo>
          <BoxInfo
            title="Set Power"
            description="Which token pair would you like to add liquidity to."
          >
            <FormField
              control={form.control}
              name="power"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormControl>
                    <SliderBar
                      {...field}
                      value={field.value}
                      setValue={(value) => field.onChange(value)}
                      min={2}
                      max={32}
                      // step={0.001}
                      step={1}
                      className="mt-5"
                      indices={[2, 7, 12, 17, 22, 27, 32]}
                    />
                  </FormControl>
                  <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                </FormItem>
              )}
            />
          </BoxInfo>
          <p className="w-full text-right font-normal text-base/6 text-[#94A3B8]">
            Position Discount: <span className="font-bold text-white">15.5%</span>
          </p>
        </div>
        <Separator />
        {/* Advanced Section */}
        <div className="p-6">
          <h4 className="font-normal text-base/6 text-[#94A3B8] mb-7">Advanced</h4>
          <div className="w-full flex flex-col gap-20">
            <BoxInfo title="Position Half Life">
              <FormField
                control={form.control}
                name="halfLife"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Input
                          placeholder="0"
                          value={field.value}
                          onChange={(e) => {
                            return field.onChange(parseFloat(e.target.value));
                          }}
                          type="number"
                          className={cn(
                            "p-4 bg-transparent mb-4",
                            errors.halfLife && "border-[#FF3318]"
                          )}
                        />
                        <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                        <SliderBar
                          {...field}
                          value={field.value}
                          setValue={(value) => field.onChange(value)}
                          min={0}
                          max={1000}
                          step={0.001}
                          className="mt-5"
                          indices={[0, 250, 500, 750, 1000]}
                        />
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />
            </BoxInfo>
            <BoxInfo title="Price Update Factor">
              <FormField
                control={form.control}
                name="priceUpdateFactor"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Input
                          placeholder="0"
                          value={field.value}
                          onChange={(e) => {
                            return field.onChange(parseFloat(e.target.value));
                          }}
                          type="number"
                          className={cn(
                            "p-4 bg-transparent mb-4",
                            errors.priceUpdateFactor && "border-[#FF3318]"
                          )}
                        />
                        <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                        <SliderBar
                          {...field}
                          value={field.value}
                          setValue={(value) => field.onChange(value)}
                          min={0}
                          max={1}
                          step={0.001}
                          className="mt-5"
                          indices={[0, 0.25, 0.5, 0.75, 1]}
                        />
                      </>
                    </FormControl>
                  </FormItem>
                )}
              />
            </BoxInfo>
            <div className="w-full">
              <ButtonCTA
                className="w-1/2 rounded-lg float-right"
                disabled={!(form.formState.isValid && form.formState.isDirty)}
              >
                Create Pool
              </ButtonCTA>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
