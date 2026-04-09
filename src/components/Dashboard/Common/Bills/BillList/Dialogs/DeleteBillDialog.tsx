"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteBillMutation } from "@/redux/reducers/Common/Bills/BillsApi";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeleteBillDialogProps {
  alias?: string;
  billLabel?: string;
  children?: React.ReactNode;
}

const DeleteBillDialog: React.FC<DeleteBillDialogProps> = ({
  alias,
  billLabel,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [deleteBill, { isLoading }] = useDeleteBillMutation();

  const handleDelete = async () => {
    if (!alias) {
      toast.error("Unable to delete bill. Missing identifier.");
      return;
    }

    try {
      await deleteBill(alias).unwrap();
      toast.success("Bill deleted successfully.");
      setOpen(false);
    } catch (error) {
      toast.error("Unable to delete bill. Please try again.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="danger" size="sm">
            <Trash />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete bill?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {billLabel ?? "this bill"}? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBillDialog;
