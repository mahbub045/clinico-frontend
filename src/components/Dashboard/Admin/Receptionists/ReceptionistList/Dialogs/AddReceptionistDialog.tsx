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
import { useAddReceptionistMutation } from "@/redux/reducers/Admin/Receptionists/ReceptionistsApi";
import { AddReceptionistPayload } from "@/types/Admin/Receptionists/ReceptionistsType";
import { Plus } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

const initialFormState: AddReceptionistPayload = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: "",
  title: null,
  suburb: "",
  postal_code: "",
  address: "",
  profile_image: null,
  employee_id: "",
  joining_date: null,
  shift: "",
  desk_number: "",
  experience_years: null,
};

const AddReceptionistDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] =
    useState<AddReceptionistPayload>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [addReceptionist, { isLoading }] = useAddReceptionistMutation();

  const clearFieldError = (key: keyof AddReceptionistPayload) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const handleInputChange =
    (key: Exclude<keyof AddReceptionistPayload, "profile_image">) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      clearFieldError(key);
      setFormData((prev) => ({
        ...prev,
        [key]:
          value === ""
            ? key === "title" ||
              key === "joining_date" ||
              key === "experience_years"
              ? null
              : ""
            : value,
      }));
    };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    clearFieldError("profile_image");
    setFormData((prev) => ({
      ...prev,
      profile_image: file,
    }));
  };

  const handleChange = (key: keyof AddReceptionistPayload, value: string) => {
    clearFieldError(key);
    setFormData((prev) => ({
      ...prev,
      [key]: value === "" ? null : value,
    }));
  };

  const renderFieldError = (field: keyof AddReceptionistPayload) =>
    fieldErrors[field]?.map((error, idx) => (
      <p key={idx} className="text-destructive text-xs">
        {error}
      </p>
    ));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        title: formData.title || "",
        suburb: formData.suburb,
        postal_code: formData.postal_code,
        address: formData.address,
        employee_id: formData.employee_id,
        joining_date: formData.joining_date ?? null,
        shift: formData.shift,
        desk_number: formData.desk_number,
        experience_years: formData.experience_years ?? null,
      } as Record<string, unknown>;

      const body: FormData | Record<string, unknown> =
        formData.profile_image != null ? new FormData() : payload;

      if (body instanceof FormData) {
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== null) {
            body.append(key, String(value));
          }
        });
        if (formData.profile_image) {
          body.append("profile_image", formData.profile_image);
        }
      }

      await addReceptionist(body).unwrap();
      toast.success("Receptionist added successfully.");
      setFormData(initialFormState);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add receptionist", error);

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

      toast.error("Failed to add receptionist. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="secondary">
          <Plus />
          Add Receptionist
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-xl! overflow-y-auto shadow-md sm:max-w-3xl! md:max-w-4xl!">
        <DialogHeader>
          <DialogTitle>Add receptionist</DialogTitle>
          <DialogDescription>
            Add a new receptionist using the fields below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="title"
                className="text-foreground text-sm font-medium"
              >
                Title
              </label>
              <Select
                value={formData.title ?? ""}
                onValueChange={(value) => handleChange("title", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MR">Mr</SelectItem>
                  <SelectItem value="MRS">Mrs</SelectItem>
                  <SelectItem value="MS">Ms</SelectItem>
                  <SelectItem value="DR">Dr</SelectItem>
                  <SelectItem value="PROFESSOR">Professor</SelectItem>
                </SelectContent>
              </Select>
              {renderFieldError("title")}
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="first_name"
                className="text-foreground text-sm font-medium"
              >
                First name<span className="text-destructive">*</span>
              </label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={handleInputChange("first_name")}
                placeholder="First name"
                required
                aria-required="true"
              />
              {renderFieldError("first_name")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="last_name"
                className="text-foreground text-sm font-medium"
              >
                Last name<span className="text-destructive">*</span>
              </label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={handleInputChange("last_name")}
                placeholder="Last name"
                required
                aria-required="true"
              />
              {renderFieldError("last_name")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="email"
                className="text-foreground text-sm font-medium"
              >
                Email<span className="text-destructive">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange("email")}
                placeholder="Email"
                required
                aria-required="true"
              />
              {renderFieldError("email")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="password"
                className="text-foreground text-sm font-medium"
              >
                Password<span className="text-destructive">*</span>
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange("password")}
                placeholder="Password"
                required
                aria-required="true"
              />
              {renderFieldError("password")}
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
                required
              />
              {renderFieldError("phone")}
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
                htmlFor="employee_id"
                className="text-foreground text-sm font-medium"
              >
                Employee ID
              </label>
              <Input
                id="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange("employee_id")}
                placeholder="Employee ID"
              />
              {renderFieldError("employee_id")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="joining_date"
                className="text-foreground text-sm font-medium"
              >
                Joining date
              </label>
              <Input
                id="joining_date"
                type="date"
                value={formData.joining_date ?? ""}
                onChange={handleInputChange("joining_date")}
              />
              {renderFieldError("joining_date")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="shift"
                className="text-foreground text-sm font-medium"
              >
                Shift
              </label>
              <Input
                id="shift"
                value={formData.shift}
                onChange={handleInputChange("shift")}
                placeholder="Shift"
              />
              {renderFieldError("shift")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="desk_number"
                className="text-foreground text-sm font-medium"
              >
                Desk number
              </label>
              <Input
                id="desk_number"
                value={formData.desk_number}
                onChange={handleInputChange("desk_number")}
                placeholder="Desk number"
              />
              {renderFieldError("desk_number")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="experience_years"
                className="text-foreground text-sm font-medium"
              >
                Experience years
              </label>
              <Input
                id="experience_years"
                type="number"
                min="0"
                value={formData.experience_years ?? ""}
                onChange={handleInputChange("experience_years")}
                placeholder="Experience years"
              />
              {renderFieldError("experience_years")}
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
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save receptionist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReceptionistDialog;
