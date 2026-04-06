"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { useAddPatientMutation } from "@/redux/reducers/Common/Patients/PatientsApi";
import { AddPatientPayload } from "@/types/Common/Patients/PatientsType";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const initialFormState: AddPatientPayload = {
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  title: null,
  suburb: "",
  postal_code: "",
  address: "",
  profile_image: null,
  date_of_birth: null,
  gender: null,
  blood_group: null,
  emergency_contact_name: "",
  emergency_contact_phone: "",
  medical_history: "",
};

const AddPatientDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AddPatientPayload>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [addPatient, { isLoading }] = useAddPatientMutation();

  const clearFieldError = (key: keyof AddPatientPayload) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const handleInputChange =
    (key: Exclude<keyof AddPatientPayload, "profile_image">) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    setFormData((prev) => ({
      ...prev,
      profile_image: file,
    }));
  };

  const handleChange = (key: keyof AddPatientPayload, value: string) => {
    clearFieldError(key);
    setFormData((prev) => ({
      ...prev,
      [key]: value === "" ? null : value,
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
      const body = new FormData();
      body.append("email", formData.email);
      body.append("first_name", formData.first_name);
      body.append("last_name", formData.last_name);
      body.append("phone", formData.phone);
      body.append("title", formData.title || "");
      body.append("suburb", formData.suburb);
      body.append("postal_code", formData.postal_code);
      body.append("address", formData.address);
      body.append("date_of_birth", formData.date_of_birth || "");
      body.append("gender", formData.gender || "");
      body.append("blood_group", formData.blood_group || "");
      body.append("emergency_contact_name", formData.emergency_contact_name);
      body.append("emergency_contact_phone", formData.emergency_contact_phone);
      body.append("medical_history", formData.medical_history);
      if (formData.profile_image) {
        body.append("profile_image", formData.profile_image);
      }

      await addPatient(body).unwrap();
      toast.success("Patient added successfully.");
      setFormData(initialFormState);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add patient", error);

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

      toast.error("Failed to add patient. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus /> Add patient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-xl! overflow-y-auto shadow-md sm:max-w-3xl! md:max-w-4xl!">
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>
            Enter the patient details below. All fields are included in the API
            payload.
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
                value={formData.title ?? "MR"}
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
              {fieldErrors.title?.map((error, idx) => (
                <p key={idx} className="text-destructive text-xs">
                  {error}
                </p>
              ))}
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
              {fieldErrors.first_name?.map((error, idx) => (
                <p key={idx} className="text-destructive text-xs">
                  {error}
                </p>
              ))}
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
              {fieldErrors.last_name?.map((error, idx) => (
                <p key={idx} className="text-destructive text-xs">
                  {error}
                </p>
              ))}
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
                placeholder="Email address"
              />
              {fieldErrors.email?.map((error, idx) => (
                <p key={idx} className="text-destructive text-xs">
                  {error}
                </p>
              ))}
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
                type="tel"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                placeholder="Phone number"
              />
              {renderFieldError("phone")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="profile_image"
                className="text-foreground text-sm font-medium"
              >
                Profile image
              </label>
              <Input
                id="profile_image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.profile_image ? (
                <p className="text-muted-foreground text-sm">
                  Selected file: {formData.profile_image.name}
                </p>
              ) : null}
              {renderFieldError("profile_image")}
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
                value={formData.gender ?? "none"}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select...</SelectItem>
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
                value={formData.blood_group ?? "none"}
                onValueChange={(value) => handleChange("blood_group", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select...</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
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

            <div className="grid gap-2 md:col-span-2">
              <label
                htmlFor="emergency_contact_name"
                className="text-foreground text-sm font-medium"
              >
                Emergency contact name
              </label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleInputChange("emergency_contact_name")}
                placeholder="Emergency contact name"
              />
              {renderFieldError("emergency_contact_name")}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <label
                htmlFor="emergency_contact_phone"
                className="text-foreground text-sm font-medium"
              >
                Emergency contact phone
              </label>
              <Input
                id="emergency_contact_phone"
                type="tel"
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
              />
              {renderFieldError("medical_history")}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
