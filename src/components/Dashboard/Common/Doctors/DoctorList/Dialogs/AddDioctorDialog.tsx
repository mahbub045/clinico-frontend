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
import { useAddDoctorMutation } from "@/redux/reducers/Common/Doctors/DoctorsApi";
import { AddDoctorPayload } from "@/types/Common/Doctors/DoctorsType";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const initialFormState: AddDoctorPayload = {
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
  degree: "",
  specialization: "",
  joined_date: null,
  consultation_fee: null,
  chamber_room: "",
  experience_years: null,
  bio: "",
  gender: null,
};

const AddDioctorDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AddDoctorPayload>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [addDoctor, { isLoading }] = useAddDoctorMutation();

  const clearFieldError = (key: keyof AddDoctorPayload) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const handleInputChange =
    (key: Exclude<keyof AddDoctorPayload, "profile_image">) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      clearFieldError(key);
      setFormData((prev) => ({
        ...prev,
        [key]:
          value === ""
            ? key === "title" ||
              key === "gender" ||
              key === "joined_date" ||
              key === "consultation_fee" ||
              key === "experience_years"
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

  const handleChange = (key: keyof AddDoctorPayload, value: string) => {
    clearFieldError(key);
    setFormData((prev) => ({
      ...prev,
      [key]: value === "" ? null : value,
    }));
  };

  const renderFieldError = (field: keyof AddDoctorPayload) =>
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
      body.append("password", formData.password);
      body.append("first_name", formData.first_name);
      body.append("last_name", formData.last_name);
      body.append("phone", formData.phone);
      body.append("title", formData.title || "");
      body.append("suburb", formData.suburb);
      body.append("postal_code", formData.postal_code);
      body.append("address", formData.address);
      body.append("degree", formData.degree);
      body.append("specialization", formData.specialization);
      body.append("joined_date", formData.joined_date || "");
      body.append("consultation_fee", formData.consultation_fee || "");
      body.append("chamber_room", formData.chamber_room);
      body.append("experience_years", formData.experience_years || "");
      body.append("bio", formData.bio);
      body.append("gender", formData.gender || "");
      if (formData.profile_image) {
        body.append("profile_image", formData.profile_image);
      }

      await addDoctor(body).unwrap();
      toast.success("Doctor added successfully.");
      setFormData(initialFormState);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add doctor", error);

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

      toast.error("Failed to add doctor. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="secondary">
          <Plus />
          Add doctor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-xl! overflow-y-auto shadow-md sm:max-w-3xl! md:max-w-4xl!">
        <DialogHeader>
          <DialogTitle>Add doctor</DialogTitle>
          <DialogDescription>
            Enter doctor details below. All fields are included in the API
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
                value={formData.title ?? "DR"}
                onValueChange={(value) => handleChange("title", value)}
                required
                aria-required="true"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
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
                First name<span className="text-danger">*</span>
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
                Last name<span className="text-danger">*</span>
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
                Email<span className="text-danger">*</span>
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
                Password<span className="text-danger">*</span>
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
                htmlFor="degree"
                className="text-foreground text-sm font-medium"
              >
                Degree
              </label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={handleInputChange("degree")}
                placeholder="Degree"
              />
              {renderFieldError("degree")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="specialization"
                className="text-foreground text-sm font-medium"
              >
                Specialization
              </label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={handleInputChange("specialization")}
                placeholder="Specialization"
              />
              {renderFieldError("specialization")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="joined_date"
                className="text-foreground text-sm font-medium"
              >
                Joined date
              </label>
              <Input
                id="joined_date"
                type="date"
                value={formData.joined_date ?? ""}
                onChange={handleInputChange("joined_date")}
              />
              {renderFieldError("joined_date")}
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="consultation_fee"
                className="text-foreground text-sm font-medium"
              >
                Consultation fee
              </label>
              <Input
                id="consultation_fee"
                type="number"
                step="0.01"
                min="0"
                value={formData.consultation_fee ?? ""}
                onChange={handleInputChange("consultation_fee")}
                placeholder="Consultation fee"
              />
              {renderFieldError("consultation_fee")}
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

            <div className="grid gap-2">
              <label
                htmlFor="chamber_room"
                className="text-foreground text-sm font-medium"
              >
                Chamber room
              </label>
              <Input
                id="chamber_room"
                value={formData.chamber_room}
                onChange={handleInputChange("chamber_room")}
                placeholder="Chamber room"
              />
              {renderFieldError("chamber_room")}
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
              <Textarea
                id="address"
                value={formData.address}
                onChange={handleInputChange("address")}
                placeholder="Address"
                rows={2}
              />
              {renderFieldError("address")}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <label
                htmlFor="bio"
                className="text-foreground text-sm font-medium"
              >
                Bio
              </label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={handleInputChange("bio")}
                placeholder="Doctor biography"
                rows={3}
              />
              {renderFieldError("bio")}
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
              {isLoading ? "Saving..." : "Save doctor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDioctorDialog;
