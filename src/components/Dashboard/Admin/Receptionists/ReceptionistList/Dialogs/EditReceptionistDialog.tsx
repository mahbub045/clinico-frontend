import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useEditReceptionistMutation } from "@/redux/reducers/Admin/Receptionists/ReceptionistsApi";
import { Edit } from "lucide-react";

const EditReceptionistDialog: React.FC = () => {
  const [editReceptionist, { isLoading }] = useEditReceptionistMutation();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="secondary">
          <Edit />
          Edit Receptionist
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

export default EditReceptionistDialog;
