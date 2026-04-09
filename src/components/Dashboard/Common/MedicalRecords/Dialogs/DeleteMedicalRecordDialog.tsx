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
import { useDeleteMedicalRecordMutation } from "@/redux/reducers/Common/MedicalRecords/MedicalRecordsApi";
import { Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "react-toastify";

interface DeleteMedicalRecordDialogProps {
  alias?: string | null;
  recordLabel?: string | null;
  children?: ReactNode;
}

const DeleteMedicalRecordDialog = ({
  alias,
  recordLabel,
  children,
}: DeleteMedicalRecordDialogProps) => {
  const [open, setOpen] = useState(false);
  const [deleteMedicalRecord, { isLoading }] = useDeleteMedicalRecordMutation();

  const handleDelete = async () => {
    if (!alias) {
      toast.error("Unable to delete medical record. Missing identifier.");
      return;
    }

    try {
      await deleteMedicalRecord(alias).unwrap();
      toast.success("Medical record deleted successfully.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete medical record", error);
      toast.error("Unable to delete medical record. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="danger" size="sm">
            <Trash2 className="size-4" />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete medical record?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {recordLabel ?? "this medical record"}? This action cannot be undone.
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
            {isLoading ? "Deleting..." : "Delete medical record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMedicalRecordDialog;
