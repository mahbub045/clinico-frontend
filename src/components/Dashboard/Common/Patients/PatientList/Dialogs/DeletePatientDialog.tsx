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
import { useDeletePatientMutation } from "@/redux/reducers/Common/Patients/PatientsApi";
import { DeletePatientDialogProps } from "@/types/Common/Patients/PatientsType";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const DeletePatientDialog: React.FC<DeletePatientDialogProps> = ({
  alias,
  patientName,
  children,
}) => {
  const [deletePatient, { isLoading }] = useDeletePatientMutation();

  const handleDelete = async () => {
    try {
      await deletePatient(alias).unwrap();
      toast.success("Patient deleted successfully.");
    } catch (error) {
      toast.error("Unable to delete patient. Please try again.");
      console.error(error);
    }
  };

  return (
    <Dialog>
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
          <DialogTitle>Delete patient?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {patientName ?? "this patient"}?
            This action cannot be undone.
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
            {isLoading ? "Deleting..." : "Delete patient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePatientDialog;
