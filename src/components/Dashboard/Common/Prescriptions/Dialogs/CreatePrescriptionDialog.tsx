"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
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
import { Textarea } from "@/components/ui/textarea";
import {
  useCreatePrescriptionMutation,
  useGetMyAppointmentsQuery,
} from "@/redux/reducers/Common/Prescriptions/PrescriptionsApi";
import { Appointment } from "@/types/Common/Appointments/AppointmentsType";
import { CreatePrescriptionPayload } from "@/types/Common/Prescriptions/PrescriptionsType";

const initialPayload: CreatePrescriptionPayload = {
  appointment: "",
  diagnosis: "",
  medicines: "",
  advice: "",
  notes: "",
};

const CreatePrescriptionDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] =
    useState<CreatePrescriptionPayload>(initialPayload);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [createPrescription, { isLoading }] = useCreatePrescriptionMutation();

  const [appointmentQuery, setAppointmentQuery] = useState("");
  const [debouncedAppointmentQuery, setDebouncedAppointmentQuery] =
    useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointmentPortalContainer, setAppointmentPortalContainer] =
    useState<HTMLDivElement | null>(null);

  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
    isFetching: appointmentsFetching,
  } = useGetMyAppointmentsQuery(
    debouncedAppointmentQuery.length ? debouncedAppointmentQuery : undefined,
    { skip: !open },
  );

  const appointmentsList = Array.isArray(appointmentsData)
    ? appointmentsData
    : appointmentsData &&
        typeof appointmentsData === "object" &&
        "results" in appointmentsData
      ? (appointmentsData.results as Appointment[])
      : [];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedAppointmentQuery(appointmentQuery.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [appointmentQuery]);

  const getAppointmentLabel = (appointment: Appointment) => {
    const date = appointment.appointment_date ?? "";
    const time = appointment.appointment_time ?? "";
    const patientName = appointment.patient?.full_name ?? "Unknown patient";
    return date
      ? `${patientName} • ${date}${time ? ` • ${time}` : ""}`
      : `Appointment #${appointment.id}`;
  };

  const clearFieldError = (field: keyof CreatePrescriptionPayload) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  };

  const handleAppointmentSelect = (appointment: Appointment | null) => {
    setSelectedAppointment(appointment);
    if (appointment) {
      setAppointmentQuery(getAppointmentLabel(appointment));
      setFormData((prev) => ({
        ...prev,
        appointment: String(appointment.id),
      }));
      clearFieldError("appointment");
    } else {
      setFormData((prev) => ({ ...prev, appointment: "" }));
    }
  };

  const resetForm = () => {
    setFormData(initialPayload);
    setFieldErrors({});
    setAppointmentQuery("");
    setSelectedAppointment(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFieldErrors({});

    if (!formData.appointment || !formData.diagnosis || !formData.medicines) {
      setFieldErrors({
        appointment: formData.appointment ? [] : ["Appointment is required"],
        diagnosis: formData.diagnosis ? [] : ["Diagnosis is required"],
        medicines: formData.medicines ? [] : ["Medicines are required"],
      });
      return;
    }

    try {
      await createPrescription({
        ...formData,
        appointment: Number(formData.appointment),
      }).unwrap();
      toast.success("Prescription created successfully.");
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Unable to create prescription. Please try again.");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Create prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle>Create prescription</DialogTitle>
          <DialogDescription>
            Add a new prescription record and save it to the prescriptions list.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="appointment-search"
              >
                Appointment<span className="text-danger">*</span>
              </label>
              <div ref={setAppointmentPortalContainer} />
              <Combobox
                items={appointmentsList}
                value={selectedAppointment}
                onValueChange={handleAppointmentSelect}
                inputValue={appointmentQuery}
                onInputValueChange={(next) => {
                  setAppointmentQuery(next);
                  if (
                    selectedAppointment &&
                    next !== getAppointmentLabel(selectedAppointment)
                  ) {
                    setSelectedAppointment(null);
                    setFormData((prev) => ({ ...prev, appointment: "" }));
                  }
                }}
                isItemEqualToValue={(item, value) => item.id === value.id}
                itemToStringLabel={(item) => getAppointmentLabel(item)}
                itemToStringValue={(item) => String(item.id)}
                disabled={appointmentsLoading}
              >
                <ComboboxInput
                  className="w-full"
                  id="appointment-search"
                  required
                  placeholder={
                    appointmentsLoading || appointmentsFetching
                      ? "Searching appointments..."
                      : "Search appointments..."
                  }
                  showClear
                />
                <ComboboxContent portalContainer={appointmentPortalContainer}>
                  <ComboboxEmpty>
                    {appointmentsLoading || appointmentsFetching
                      ? "Searching..."
                      : "No appointments found."}
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(appointment: Appointment) => (
                      <ComboboxItem key={appointment.id} value={appointment}>
                        {getAppointmentLabel(appointment)}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {fieldErrors.appointment?.map((message) => (
                <p key={message} className="text-destructive text-xs">
                  {message}
                </p>
              ))}
            </div>

            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="diagnosis"
              >
                Diagnosis<span className="text-danger">*</span>
              </label>
              <Input
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(event) =>
                  setFormData({ ...formData, diagnosis: event.target.value })
                }
                placeholder="Enter diagnosis"
                required
              />
              {fieldErrors.diagnosis?.map((message) => (
                <p key={message} className="text-destructive text-xs">
                  {message}
                </p>
              ))}
            </div>

            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="medicines"
              >
                Medicines<span className="text-danger">*</span>
              </label>
              <Textarea
                id="medicines"
                value={formData.medicines}
                onChange={(event) =>
                  setFormData({ ...formData, medicines: event.target.value })
                }
                placeholder="List medicines and instructions"
                rows={4}
                required
              />
              {fieldErrors.medicines?.map((message) => (
                <p key={message} className="text-destructive text-xs">
                  {message}
                </p>
              ))}
            </div>

            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="advice"
              >
                Advice
              </label>
              <Textarea
                id="advice"
                value={formData.advice}
                onChange={(event) =>
                  setFormData({ ...formData, advice: event.target.value })
                }
                placeholder="Add advice for the patient"
                rows={3}
              />
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
                onChange={(event) =>
                  setFormData({ ...formData, notes: event.target.value })
                }
                placeholder="Any internal notes"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button variant="ghost" size="sm" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button size="sm" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create prescription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePrescriptionDialog;
