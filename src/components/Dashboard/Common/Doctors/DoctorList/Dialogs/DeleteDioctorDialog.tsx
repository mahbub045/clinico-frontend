import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Trash } from "lucide-react";

const DeleteDioctorDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="danger">
          <Trash />
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

export default DeleteDioctorDialog;
