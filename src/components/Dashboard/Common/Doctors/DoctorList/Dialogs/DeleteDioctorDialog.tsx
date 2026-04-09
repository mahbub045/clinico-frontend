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
import { useDeleteDoctorMutation } from "@/redux/reducers/Common/Doctors/DoctorsApi";
import { DeleteDoctorDialogProps } from "@/types/Common/Doctors/DoctorsType";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const DeleteDioctorDialog: React.FC<DeleteDoctorDialogProps> = ({
  alias,
  doctorName,
  children,
}) => {
  const [deleteDoctor, { isLoading }] = useDeleteDoctorMutation();

  const handleDelete = async () => {
    if (!alias) {
      toast.error("Unable to delete doctor. Missing identifier.");
      return;
    }

    try {
      await deleteDoctor(alias).unwrap();
      toast.success("Doctor deleted successfully.");
    } catch (error) {
      toast.error("Unable to delete doctor. Please try again.");
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="danger" size="sm">
            <Trash2 className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete doctor?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {doctorName ?? "this doctor"}? This
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
            {isLoading ? "Deleting..." : "Delete doctor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDioctorDialog;
