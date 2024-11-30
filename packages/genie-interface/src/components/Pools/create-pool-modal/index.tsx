"use client";

// import { ReactNode, useMemo, useState } from "react";
import Modal from "@components/common/Modal";
import { DialogHeader, DialogDescription, DialogTitle } from "@components/ui/dialog";
// import notification from "@components/common/notification";
import CreatePoolForm from "./CreatePoolForm";

const CreatePoolModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-[698px] sm:rounded-lg"
      closable={true}
    >
      <DialogHeader className="pt-11 pb-14 px-6">
        <DialogTitle>Pool Settings</DialogTitle>
        <DialogDescription>
          Create a new pool or create a liquidity position on an existing pool.
        </DialogDescription>
      </DialogHeader>
      <CreatePoolForm />
    </Modal>
  );
};

export default CreatePoolModal;
