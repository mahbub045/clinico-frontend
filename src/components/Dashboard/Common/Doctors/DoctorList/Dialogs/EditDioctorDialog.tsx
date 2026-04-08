import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit } from "lucide-react";

const EditDioctorDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Edit />
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

export default EditDioctorDialog;
