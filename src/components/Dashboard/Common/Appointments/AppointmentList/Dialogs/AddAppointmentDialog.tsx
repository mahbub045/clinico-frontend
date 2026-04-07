"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

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
import { useCreateAppointmentMutation } from "@/redux/reducers/Common/Appointments/AppointmentsApi";
import { useGetDoctorsQuery } from "@/redux/reducers/Common/Doctors/DoctorsApi";
import { useGetPatientsQuery } from "@/redux/reducers/Common/Patients/PatientsApi";
import {
  AddAppointmentPayload,
  OptionRecord,
} from "@/types/Common/Appointments/AppointmentsType";

const initialFormState: AddAppointmentPayload = {
  patient_id: "",
  doctor_id: "",
  appointment_date: "",
  appointment_time: "",
  status: "PENDING",
  reason: "",
  notes: "",
};

const AddAppointmentDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] =
    useState<AddAppointmentPayload>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const { data: doctors, isLoading: doctorsLoading } =
    useGetDoctorsQuery(undefined);
  const { data: patients, isLoading: patientsLoading } =
    useGetPatientsQuery(undefined);
  const [createAppointment, { isLoading: creatingAppointment }] =
    useCreateAppointmentMutation();

  const patientsList: OptionRecord[] = Array.isArray(patients)
    ? patients
    : patients && typeof patients === "object" && "results" in patients
      ? ((patients as { results?: OptionRecord[] }).results ?? [])
      : [];

  const doctorsList: OptionRecord[] = Array.isArray(doctors)
    ? doctors
    : doctors && typeof doctors === "object" && "results" in doctors
      ? ((doctors as { results?: OptionRecord[] }).results ?? [])
      : [];

  const clearFieldError = (key: keyof AddAppointmentPayload) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const handleInputChange =
    (key: keyof AddAppointmentPayload) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      clearFieldError(key);
      setFormData((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  const handleSelectChange = (
    key: keyof AddAppointmentPayload,
    value: string,
  ) => {
    clearFieldError(key);
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderFieldError = (field: keyof AddAppointmentPayload) =>
    fieldErrors[field]?.map((error, idx) => (
      <p key={idx} className="text-destructive text-xs">
        {error}
      </p>
    ));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});

    try {
      await createAppointment({
        patient_id: Number(formData.patient_id),
        doctor_id: Number(formData.doctor_id),
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        status: formData.status,
        reason: formData.reason,
        notes: formData.notes,
      }).unwrap();

      toast.success("Appointment added successfully.");
      setFormData(initialFormState);
      setOpen(false);
    } catch (error) {
      console.error("Failed to create appointment", error);

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

      toast.error("Failed to add appointment. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus /> Add appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-xl! overflow-y-auto shadow-md sm:max-w-2xl! md:max-w-3xl!">
        <DialogHeader>
          <DialogTitle>Add appointment</DialogTitle>
          <DialogDescription>
            Create a new appointment by selecting the patient, doctor, date, and
            time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="patient_id"
              >
                Patient<span className="text-danger">*</span>
              </label>
              <Select
                value={formData.patient_id}
                onValueChange={(value) =>
                  handleSelectChange("patient_id", value)
                }
                required
              >
                <SelectTrigger id="patient_id" className="w-full">
                  <SelectValue
                    placeholder={
                      patientsLoading ? "Loading patients..." : "Select patient"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {patientsList.map((patient) => (
                    <SelectItem key={patient.id} value={String(patient.id)}>
                      {patient.full_name ||
                        `${patient.first_name ?? ""} ${patient.last_name ?? ""}`.trim() ||
                        `Patient #${patient.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {renderFieldError("patient_id")}
            </div>

            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="doctor_id"
              >
                Doctor<span className="text-danger">*</span>
              </label>
              <Select
                value={formData.doctor_id}
                onValueChange={(value) =>
                  handleSelectChange("doctor_id", value)
                }
                required
              >
                <SelectTrigger id="doctor_id" className="w-full">
                  <SelectValue
                    placeholder={
                      doctorsLoading ? "Loading doctors..." : "Select doctor"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {doctorsList.map((doctor) => (
                    <SelectItem key={doctor.id} value={String(doctor.id)}>
                      {doctor.full_name ||
                        `${doctor.first_name ?? ""} ${doctor.last_name ?? ""}`.trim() ||
                        `Doctor #${doctor.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {renderFieldError("doctor_id")}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="appointment_date"
              >
                Appointment date<span className="text-danger">*</span>
              </label>
              <Input
                id="appointment_date"
                type="date"
                value={formData.appointment_date}
                onChange={handleInputChange("appointment_date")}
                required
              />
              {renderFieldError("appointment_date")}
            </div>

            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="appointment_time"
              >
                Appointment time<span className="text-danger">*</span>
              </label>
              <Input
                id="appointment_time"
                type="time"
                value={formData.appointment_time}
                onChange={handleInputChange("appointment_time")}
                required
              />
              {renderFieldError("appointment_time")}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="status"
              >
                Status<span className="text-danger">*</span>
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
                required
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              {renderFieldError("status")}
            </div>

            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="reason"
              >
                Reason
              </label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={handleInputChange("reason")}
                placeholder="Routine checkup"
              />
              {renderFieldError("reason")}
            </div>
          </div>

          <div className="grid gap-2">
            <label
              className="text-foreground text-sm font-medium"
              htmlFor="notes"
            >
              Notes
            </label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={handleInputChange("notes")}
              placeholder="Patient requested blood test and general consultation."
              rows={4}
            />
            {renderFieldError("notes")}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={creatingAppointment}>
              {creatingAppointment ? "Saving..." : "Save appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentDialog;
