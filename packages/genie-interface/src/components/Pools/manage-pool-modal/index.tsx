"use client";

import { cn } from "@lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PiCopy } from "react-icons/pi";
import Modal from "@components/common/Modal";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import SliderBar from "@components/common/slider-bar";
import ButtonCTA from "@components/common/button-cta";
import notification from "@components/common/notification";
import { DialogHeader, DialogDescription, DialogTitle } from "@components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";

import NewPoModal from "./new-po-modal";
import { formSchema, ManagePoolFormSchema } from "./managePoolFormSchema";

import { shortenHash } from "@lib/utils/formatting";
import CopyToClipboard from "react-copy-to-clipboard";

const ManagePoolModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const VAULT_ADDRESS = "0x428084313F9dCc38e9d0cB51dBBe466c8300a35c";

  const form = useForm<ManagePoolFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sqlDiscount: 0,
      halfLife: 0,
      priceUpdateFactor: 0
    },
    mode: "onChange"
  });

  const [newPoOpen, setNewPoOpen] = useState<boolean>(false);

  const POOL_OPERATORS = [
    {
      id: 123,
      address: "0x428084313F9dCc38e9d0cB51dBBe466c8300a35c",
      since: "2023 .07. 15",
      expire: "Never"
    },
    {
      id: 234,
      address: "0x428084313F9dCc38e9d0cB51dBBe466c8300a35c",
      since: "2023 .07. 15",
      expire: "2023 .07. 15"
    },
    {
      id: 345,
      address: "0x428084313F9dCc38e9d0cB51dBBe466c8300a35c",
      since: "2023 .07. 15",
      expire: "2023 .07. 15"
    },
    {
      id: 456,
      address: "0x428084313F9dCc38e9d0cB51dBBe466c8300a35c",
      since: "2023 .07. 15",
      expire: "2023 .07. 15"
    }
  ];

  function onSubmit(values: ManagePoolFormSchema) {
    console.log(values);
  }

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-[698px] sm:rounded-lg"
      closable={true}
    >
      <DialogHeader className="pt-11 pb-14 px-6">
        <DialogTitle>Manage Pool Settings</DialogTitle>
        <DialogDescription>
          Create a new pool or create a liquidity position on an existing pool.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full w-full mb-6">
          {/* SQL Discount Lock Section */}
          <div className="p-6 flex flex-col gap-10">
            <div className="flex flex-row items-start justify-between">
              <h5>SQL Discount Lock</h5>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="sqlDiscount"
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
                              errors.sqlDiscount && "border-[#FF3318]"
                            )}
                          />
                          <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                          <SliderBar
                            {...field}
                            value={field.value}
                            setValue={(value) => field.onChange(value)}
                            min={0}
                            max={2000}
                            step={1}
                            className="mt-4"
                            indices={[0, 500, 1000, 1500, 2000]}
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2 text-right font-normal text-base/6 text-[#94A3B8]">
              <p>
                Position Discount : <span className="font-bold text-white">5%</span>
              </p>
              <p className="inline-flex items-center gap-2">
                <span>Vault Address :</span>
                <span className="font-bold text-white">{shortenHash(VAULT_ADDRESS)}</span>
                <CopyToClipboard
                  text={VAULT_ADDRESS}
                  onCopy={() => {
                    // notification.success({
                    //   title: "Vault Address copied!",
                    //   duration: 2000
                    // });
                  }}
                >
                  <button aria-label="button to copy vault address">
                    <PiCopy className="text-white" />
                  </button>
                </CopyToClipboard>
              </p>
            </div>
          </div>
          <Separator />
          {/* Advanced Section */}
          <div className="p-6">
            <h4 className="font-normal text-base/6 text-[#94A3B8] mb-6">Advanced</h4>
            <div className="flex flex-row items-start justify-between mb-12">
              <h5>Position Half Life</h5>
              <div className="w-1/2">
                <FormField
                  control={form.control}
                  name="halfLife"
                  render={({ field, formState: { errors } }) => (
                    <FormItem>
                      <FormControl>
                        <>
                          <Input
                            {...field}
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
                        </>
                      </FormControl>
                      <FormMessage className="text-[#FF3318] text-sm/5 -mt-2 mb-3" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-row items-start justify-between mb-10">
              <h5>Price Update Factor</h5>
              <div className="w-1/2">
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
                            className="mt-4"
                            indices={[0, 0.25, 0.5, 0.75, 1]}
                          />
                        </>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <ButtonCTA
              className="w-1/2 rounded-lg float-right"
              disabled={!(form.formState.isValid && form.formState.isDirty)}
            >
              Update
            </ButtonCTA>
          </div>
        </form>
      </Form>

      <Separator />

      {/* Pool Operators Section */}
      <div className="p-6">
        <h4 className="font-normal text-base/6 text-[#94A3B8] mb-6">Pool Operators</h4>
        <Table className="text-base/6 mb-9">
          <TableHeader className="text-[#94A3B8]">
            <TableRow>
              <TableHead className="w-[100px]">Wallet</TableHead>
              <TableHead>Since</TableHead>
              <TableHead>Expire</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {POOL_OPERATORS.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="pb-1">{shortenHash(po.address)}</TableCell>
                <TableCell>{po.since}</TableCell>
                <TableCell>{po.expire}</TableCell>
                <TableCell className="text-center">
                  <button className="text-[#01A1FF]" aria-label="Revoke Pool Operator">
                    Revoke
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ButtonCTA
          className="w-1/2 rounded-lg float-right"
          onClick={() => setNewPoOpen(true)}
        >
          New PO
        </ButtonCTA>
      </div>
      <NewPoModal open={newPoOpen} setOpen={setNewPoOpen} />
    </Modal>
  );
};

export default ManagePoolModal;
