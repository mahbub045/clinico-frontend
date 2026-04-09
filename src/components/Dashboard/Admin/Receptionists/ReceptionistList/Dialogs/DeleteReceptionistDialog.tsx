import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useDeleteReceptionistMutation } from "@/redux/reducers/Admin/Receptionists/ReceptionistsApi";
import { Trash } from "lucide-react";

const DeleteReceptionistDialog: React.FC = () => {
    const [deleteReceptionist, { isLoading }] = useDeleteReceptionistMutation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="secondary">
          <Trash />
          Delete Receptionist
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

export default DeleteReceptionistDialog;
