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
import { useDeleteReceptionistMutation } from "@/redux/reducers/Admin/Receptionists/ReceptionistsApi";
import { DeleteReceptionistDialogProps } from "@/types/Admin/Receptionists/ReceptionistsType";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";

const DeleteReceptionistDialog: React.FC<DeleteReceptionistDialogProps> = ({
  alias,
  receptionistName,
  children,
}) => {
  const [deleteReceptionist, { isLoading }] = useDeleteReceptionistMutation();

  const handleDelete = async () => {
    try {
      await deleteReceptionist(alias).unwrap();
      toast.success("Receptionist deleted successfully.");
    } catch (error) {
      toast.error("Unable to delete receptionist. Please try again.");
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="danger" size="sm">
            <Trash />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete receptionist?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {receptionistName ?? "this receptionist"}? This action cannot be
            undone.
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
            {isLoading ? "Deleting..." : "Delete receptionist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteReceptionistDialog;
