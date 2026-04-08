import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const AddDioctorDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="secondary">
          <Plus />
          Add doctor
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

export default AddDioctorDialog;
