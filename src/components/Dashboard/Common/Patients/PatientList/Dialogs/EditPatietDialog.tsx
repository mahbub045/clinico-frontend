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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEditPatientMutation } from "@/redux/reducers/Common/Patients/PatientsApi";
import {
  AddPatientPayload,
  EditPatietDialogProps,
} from "@/types/Common/Patients/PatientsType";
import { Edit } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

const buildFormState = (
  values: Partial<AddPatientPayload>,
): AddPatientPayload => ({
  email: values.email ?? "",
  first_name: values.first_name ?? "",
  last_name: values.last_name ?? "",
  phone: values.phone ?? "",
  title:
    values.title === "" || values.title === undefined
      ? null
      : (values.title ?? null),
  suburb: values.suburb ?? "",
  postal_code: values.postal_code ?? "",
  address: values.address ?? "",
  profile_image: values.profile_image ?? null,
  date_of_birth:
    values.date_of_birth === "" || values.date_of_birth === undefined
      ? null
      : values.date_of_birth,
  gender:
    values.gender === "" || values.gender === undefined ? null : values.gender,
  blood_group:
    values.blood_group === "" || values.blood_group === undefined
      ? null
      : values.blood_group,
  emergency_contact_name: values.emergency_contact_name ?? "",
  emergency_contact_phone: values.emergency_contact_phone ?? "",
  medical_history: values.medical_history ?? "",
});

const EditPatietDialog: React.FC<EditPatietDialogProps> = ({
  alias,
  initialValues,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AddPatientPayload>(
    buildFormState(initialValues),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [editPatient, { isLoading }] = useEditPatientMutation();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFormData(buildFormState(initialValues));
      setFieldErrors({});
    }
    setOpen(nextOpen);
  };

  const clearFieldError = (key: keyof AddPatientPayload) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const handleInputChange =
    (key: Exclude<keyof AddPatientPayload, "profile_image">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      clearFieldError(key);
      setFormData((prev) => ({
        ...prev,
        [key]:
          value === ""
            ? key === "title" ||
              key === "gender" ||
              key === "blood_group" ||
              key === "date_of_birth"
              ? null
              : ""
            : value,
      }));
    };

  const handleChange = (key: keyof AddPatientPayload, value: string) => {
    clearFieldError(key);
    setFormData((prev) => ({
      ...prev,
      [key]: value === "" ? null : value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFormData((prev) => ({
      ...prev,
      profile_image: file,
    }));
  };

  const renderFieldError = (field: keyof AddPatientPayload) =>
    fieldErrors[field]?.map((error, idx) => (
      <p key={idx} className="text-destructive text-xs">
        {error}
      </p>
    ));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});

    try {
      const body = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        title: formData.title || "",
        suburb: formData.suburb,
        postal_code: formData.postal_code,
        address: formData.address,
        date_of_birth:
          formData.date_of_birth === "" ? null : formData.date_of_birth,
        gender: formData.gender || "",
        blood_group: formData.blood_group || "",
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        medical_history: formData.medical_history,
      };

      await editPatient({ alias, ...body }).unwrap();
      toast.success("Patient updated successfully.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to edit patient", error);

      const apiErrors =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: unknown }).data
          : null;

      if (apiErrors && typeof apiErrors === "object") {
        const parsedErrors = Object.entries(apiErrors).reduce(
          (acc, [key, value]) => {
            if (Array.isArray(value)) {
              acc[key] = value.map((item) => String(item));
            } else if (value != null) {
              acc[key] = [String(value)];
            }
            return acc;
          },
          {} as Record<string, string[]>,
        );

        if (Object.keys(parsedErrors).length > 0) {
          setFieldErrors(parsedErrors);
          toast.error("Please fix the highlighted fields.");
          return;
        }
      }

      toast.error("Failed to update patient. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="secondary" size="sm">
            <Edit />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-xl! overflow-y-auto shadow-md sm:max-w-3xl! md:max-w-4xl!">
        <DialogHeader>
          <DialogTitle>Edit patient</DialogTitle>
          <DialogDescription>
            Update this patient’s details and save your changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="title"
                className="text-foreground text-sm font-medium"
              >
                Title<span className="text-danger">*</span>
              </label>
              <Select
                value={formData.title ?? ""}
                onValueChange={(value) => handleChange("title", value)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MR">Mr</SelectItem>
                  <SelectItem value="MRS">Mrs</SelectItem>
                  <SelectItem value="MS">Ms</SelectItem>
                  <SelectItem value="DR">Dr</SelectItem>
                  <SelectItem value="MISS">Miss</SelectItem>
                  <SelectItem value="MADAM">Madam</SelectItem>
                  <SelectItem value="MAIDEN">Maiden</SelectItem>
                  <SelectItem value="PROFESSOR">Professor</SelectItem>
                  <SelectItem value="DOCTOR">Doctor</SelectItem>
                </SelectContent>
              </Select>
              {renderFieldError("title")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="first_name"
                className="text-foreground text-sm font-medium"
              >
                First name<span className="text-danger">*</span>
              </label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={handleInputChange("first_name")}
                required
                placeholder="First name"
              />
              {renderFieldError("first_name")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="last_name"
                className="text-foreground text-sm font-medium"
              >
                Last name<span className="text-danger">*</span>
              </label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={handleInputChange("last_name")}
                required
                placeholder="Last name"
              />
              {renderFieldError("last_name")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="email"
                className="text-foreground text-sm font-medium"
              >
                Email<span className="text-danger">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
                placeholder="Email"
              />
              {renderFieldError("email")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="phone"
                className="text-foreground text-sm font-medium"
              >
                Phone
              </label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                placeholder="Phone"
              />
              {renderFieldError("phone")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="date_of_birth"
                className="text-foreground text-sm font-medium"
              >
                Date of birth
              </label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth ?? ""}
                onChange={handleInputChange("date_of_birth")}
                placeholder="Date of birth"
              />
              {renderFieldError("date_of_birth")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="gender"
                className="text-foreground text-sm font-medium"
              >
                Gender
              </label>
              <Select
                value={formData.gender ?? ""}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              {renderFieldError("gender")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="blood_group"
                className="text-foreground text-sm font-medium"
              >
                Blood group
              </label>
              <Select
                value={formData.blood_group ?? ""}
                onValueChange={(value) => handleChange("blood_group", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
              {renderFieldError("blood_group")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="suburb"
                className="text-foreground text-sm font-medium"
              >
                Suburb
              </label>
              <Input
                id="suburb"
                value={formData.suburb}
                onChange={handleInputChange("suburb")}
                placeholder="Suburb"
              />
              {renderFieldError("suburb")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="postal_code"
                className="text-foreground text-sm font-medium"
              >
                Postal code
              </label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange("postal_code")}
                placeholder="Postal code"
              />
              {renderFieldError("postal_code")}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <label
                htmlFor="address"
                className="text-foreground text-sm font-medium"
              >
                Address
              </label>
              <Input
                id="address"
                value={formData.address}
                onChange={handleInputChange("address")}
                placeholder="Address"
              />
              {renderFieldError("address")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="emergency_contact_name"
                className="text-foreground text-sm font-medium"
              >
                Emergency contact
              </label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleInputChange("emergency_contact_name")}
                placeholder="Emergency contact name"
              />
              {renderFieldError("emergency_contact_name")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="emergency_contact_phone"
                className="text-foreground text-sm font-medium"
              >
                Emergency contact phone
              </label>
              <Input
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleInputChange("emergency_contact_phone")}
                placeholder="Emergency contact phone"
              />
              {renderFieldError("emergency_contact_phone")}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <label
                htmlFor="medical_history"
                className="text-foreground text-sm font-medium"
              >
                Medical history
              </label>
              <Textarea
                id="medical_history"
                value={formData.medical_history}
                onChange={handleInputChange("medical_history")}
                placeholder="Medical history"
                rows={4}
              />
              {renderFieldError("medical_history")}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <label
                htmlFor="profile_image"
                className="text-foreground text-sm font-medium"
              >
                Profile image
              </label>
              <Input
                id="profile_image"
                type="file"
                onChange={handleFileChange}
              />
              {renderFieldError("profile_image")}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="secondary" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatietDialog;
