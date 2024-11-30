import { useState } from "react";
import Modal from "@components/common/Modal";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import ButtonCTA from "@components/common/button-cta";
import SelectDate from "./select-date";
import notification from "@components/common/notification";
import { isValidAddress } from "@lib/utils/checkVadility";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const NewPoModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  // const [isExpire, setIsExpire] = useState(false);

  const [poAddr, setPoAddr] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(new Date());
  const isValid = isValidAddress(poAddr);

  const form = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      poAddress: "0",
      expiry: false,
      validityDate: new Date(),
    },
    mode: 'onChange'
  });

  function onSubmit(values: any) {
    console.log(values);
  }

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="New Pool Operator"
      description="Create a new pool or create a liquidity position on an existing pool."
      className="w-full max-w-[698px] p-6 flex flex-col gap-10 sm:rounded-lg"
      closable={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-fit flex flex-col gap-6">
          <div className="flex flex-row items-start justify-between">
            <h5>PO Address</h5>
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="poAddress"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Input
                          {...field}
                          placeholder="0"
                          type="text"
                          value={field.value}
                          onChange={(val) => field.onChange(val)}
                          className="p-4 bg-transparent"
                        />
                      </>
                    </FormControl>
                    <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row items-start justify-between">
            <h5>Expires</h5>
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="expiry"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormControl>
                      <>
                        <Switch checked={field.value} onCheckedChange={(val) => field.onChange(val)} />
                      </>
                    </FormControl>
                    <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {form.getValues('expiry') && (
            <div className="flex flex-row items-start justify-between">
              <h5>Valid Till</h5>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="validityDate"
                  render={({ field, formState: { errors } }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <SelectDate {...field} date={field.value} setDate={(val) => field.onChange(val)} />
                        </>
                      </FormControl>
                      <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          <div>
            <ButtonCTA
              className="w-1/2 rounded-lg float-right"
              onClick={() => {
                console.log("create new po!");
                // notification.info({
                //   title: "Creating new Pool operator.",
                //   description: "Wait for few seconds while we're processing"
                // });
              }}
              disabled={!isValid || !expiryDate}
            >
              Create
            </ButtonCTA>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default NewPoModal;
