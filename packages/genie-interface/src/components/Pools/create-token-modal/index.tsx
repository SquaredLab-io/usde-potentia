"use client";

import Modal from "@components/common/Modal";
import { DialogHeader, DialogDescription, DialogTitle } from "@components/ui/dialog";
import CreateTokenForm from "./CreateTokenForm";

const CreateTokenModal = ({
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
      <DialogHeader className="pt-11 pb-12 px-6">
        <DialogTitle>Create Token</DialogTitle>
        <DialogDescription>
          Create a new dummy token to test out full features on Genie
        </DialogDescription>
      </DialogHeader>
      <CreateTokenForm />
    </Modal>
  );
};

export default CreateTokenModal;
