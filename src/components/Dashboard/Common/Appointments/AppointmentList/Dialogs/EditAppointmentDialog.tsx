"use client";

import { Edit } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAppointmentMutation } from "@/redux/reducers/Common/Appointments/AppointmentsApi";
import { useGetDoctorsQuery } from "@/redux/reducers/Common/Doctors/DoctorsApi";
import { useGetPatientsQuery } from "@/redux/reducers/Common/Patients/PatientsApi";
import {
  AddAppointmentPayload,
  OptionRecord,
} from "@/types/Common/Appointments/AppointmentsType";

interface EditAppointmentDialogProps {
  alias: string;
  initialValues: Partial<AddAppointmentPayload> & {
    patient_label?: string;
    doctor_label?: string;
  };
  children?: React.ReactNode;
}

const buildFormState = (
  values: Partial<AddAppointmentPayload>,
): AddAppointmentPayload => ({
  patient_id: values.patient_id ?? "",
  doctor_id: values.doctor_id ?? "",
  appointment_date: values.appointment_date ?? "",
  appointment_time: values.appointment_time ?? "",
  status: values.status ?? "PENDING",
  reason: values.reason ?? "",
  notes: values.notes ?? "",
});

const EditAppointmentDialog: React.FC<EditAppointmentDialogProps> = ({
  alias,
  initialValues,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AddAppointmentPayload>(
    buildFormState(initialValues),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [comboboxPortalContainer, setComboboxPortalContainer] =
    useState<HTMLDivElement | null>(null);

  const [patientQuery, setPatientQuery] = useState("");
  const [doctorQuery, setDoctorQuery] = useState("");
  const [debouncedPatientQuery, setDebouncedPatientQuery] = useState("");
  const [debouncedDoctorQuery, setDebouncedDoctorQuery] = useState("");

  const [selectedPatient, setSelectedPatient] = useState<OptionRecord | null>(
    null,
  );
  const [selectedDoctor, setSelectedDoctor] = useState<OptionRecord | null>(
    null,
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedPatientQuery(patientQuery.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [patientQuery]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedDoctorQuery(doctorQuery.trim());
    }, 300);
    return () => window.clearTimeout(handle);
  }, [doctorQuery]);

  const patientSearchParams = debouncedPatientQuery.length
    ? { search: debouncedPatientQuery }
    : undefined;
  const doctorSearchParams = debouncedDoctorQuery.length
    ? { search: debouncedDoctorQuery }
    : undefined;

  const {
    data: doctors,
    isLoading: doctorsLoading,
    isFetching: doctorsFetching,
  } = useGetDoctorsQuery(doctorSearchParams, { skip: !open });
  const {
    data: patients,
    isLoading: patientsLoading,
    isFetching: patientsFetching,
  } = useGetPatientsQuery(patientSearchParams, { skip: !open });
  const [editAppointment, { isLoading: editingAppointment }] =
    useUpdateAppointmentMutation();

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

  const getOptionLabel = (option: OptionRecord, fallbackPrefix: string) =>
    option.full_name ||
    `${option.first_name ?? ""} ${option.last_name ?? ""}`.trim() ||
    `${fallbackPrefix} #${option.id}`;

  const patientsItems: OptionRecord[] = selectedPatient
    ? patientsList.some((p) => p.id === selectedPatient.id)
      ? patientsList
      : [selectedPatient, ...patientsList]
    : patientsList;

  const doctorsItems: OptionRecord[] = selectedDoctor
    ? doctorsList.some((d) => d.id === selectedDoctor.id)
      ? doctorsList
      : [selectedDoctor, ...doctorsList]
    : doctorsList;

  const syncFromInitialValues = () => {
    setFormData(buildFormState(initialValues));

    const initialPatientId = initialValues.patient_id
      ? Number(initialValues.patient_id)
      : NaN;
    const initialDoctorId = initialValues.doctor_id
      ? Number(initialValues.doctor_id)
      : NaN;

    const nextSelectedPatient = Number.isFinite(initialPatientId)
      ? ({
          id: initialPatientId,
          full_name: initialValues.patient_label ?? null,
        } as OptionRecord)
      : null;
    const nextSelectedDoctor = Number.isFinite(initialDoctorId)
      ? ({
          id: initialDoctorId,
          full_name: initialValues.doctor_label ?? null,
        } as OptionRecord)
      : null;

    setSelectedPatient(nextSelectedPatient);
    setSelectedDoctor(nextSelectedDoctor);
    setPatientQuery(
      nextSelectedPatient ? getOptionLabel(nextSelectedPatient, "Patient") : "",
    );
    setDoctorQuery(
      nextSelectedDoctor ? getOptionLabel(nextSelectedDoctor, "Doctor") : "",
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setFieldErrors({});
      syncFromInitialValues();
    } else {
      setFieldErrors({});
      syncFromInitialValues();
    }
    setOpen(nextOpen);
  };

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

    const body: Record<string, unknown> = {};
    if (formData.patient_id !== "") {
      body.patient_id = Number(formData.patient_id);
    }
    if (formData.doctor_id !== "") {
      body.doctor_id = Number(formData.doctor_id);
    }
    body.appointment_date = formData.appointment_date;
    body.appointment_time = formData.appointment_time;
    body.status = formData.status;
    body.reason = formData.reason;
    body.notes = formData.notes;

    try {
      await editAppointment({ alias, ...body }).unwrap();
      toast.success("Appointment updated successfully.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to update appointment", error);

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

      toast.error("Failed to update appointment. Please try again.");
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
      <DialogContent className="max-h-[80vh] max-w-xl! overflow-y-auto shadow-md sm:max-w-2xl! md:max-w-3xl!">
        <DialogHeader>
          <DialogTitle>Edit appointment</DialogTitle>
          <DialogDescription>
            Update appointment details and save your changes.
          </DialogDescription>
        </DialogHeader>

        <div ref={setComboboxPortalContainer} />

        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="patient_id"
              >
                Patient
              </label>
              <Combobox
                items={patientsItems}
                value={selectedPatient}
                onValueChange={(patient) => {
                  setSelectedPatient(patient);
                  setPatientQuery(
                    patient ? getOptionLabel(patient, "Patient") : "",
                  );
                  handleSelectChange(
                    "patient_id",
                    patient ? String(patient.id) : "",
                  );
                }}
                inputValue={patientQuery}
                onInputValueChange={(next) => setPatientQuery(next)}
                isItemEqualToValue={(item, value) => item.id === value.id}
                itemToStringLabel={(item) => getOptionLabel(item, "Patient")}
                itemToStringValue={(item) => String(item.id)}
                disabled={patientsLoading}
              >
                <ComboboxInput
                  className="w-full"
                  id="patient_id"
                  placeholder={
                    patientsLoading
                      ? "Loading patients..."
                      : "Search by name, email or phone..."
                  }
                  showClear
                />
                <ComboboxContent portalContainer={comboboxPortalContainer}>
                  <ComboboxEmpty>
                    {patientsLoading || patientsFetching
                      ? "Searching..."
                      : "No patients found."}
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(patient: OptionRecord) => (
                      <ComboboxItem key={patient.id} value={patient}>
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate">
                            {getOptionLabel(patient, "Patient")}
                          </span>
                          {(
                            patient as unknown as {
                              email?: string | null;
                              phone?: string | null;
                            }
                          ).email ||
                          (
                            patient as unknown as {
                              email?: string | null;
                              phone?: string | null;
                            }
                          ).phone ? (
                            <span className="text-muted-foreground truncate text-xs">
                              {(
                                patient as unknown as {
                                  email?: string | null;
                                  phone?: string | null;
                                }
                              ).email ??
                                (
                                  patient as unknown as {
                                    email?: string | null;
                                    phone?: string | null;
                                  }
                                ).phone}
                            </span>
                          ) : null}
                        </span>
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {renderFieldError("patient_id")}
            </div>

            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="doctor_id"
              >
                Doctor
              </label>
              <Combobox
                items={doctorsItems}
                value={selectedDoctor}
                onValueChange={(doctor) => {
                  setSelectedDoctor(doctor);
                  setDoctorQuery(
                    doctor ? getOptionLabel(doctor, "Doctor") : "",
                  );
                  handleSelectChange(
                    "doctor_id",
                    doctor ? String(doctor.id) : "",
                  );
                }}
                inputValue={doctorQuery}
                onInputValueChange={(next) => setDoctorQuery(next)}
                isItemEqualToValue={(item, value) => item.id === value.id}
                itemToStringLabel={(item) => getOptionLabel(item, "Doctor")}
                itemToStringValue={(item) => String(item.id)}
                disabled={doctorsLoading}
              >
                <ComboboxInput
                  className="w-full"
                  id="doctor_id"
                  placeholder={
                    doctorsLoading ? "Loading doctors..." : "Search doctor..."
                  }
                  showClear
                />
                <ComboboxContent portalContainer={comboboxPortalContainer}>
                  <ComboboxEmpty>
                    {doctorsLoading || doctorsFetching
                      ? "Searching..."
                      : "No doctors found."}
                  </ComboboxEmpty>
                  <ComboboxList>
                    {(doctor: OptionRecord) => (
                      <ComboboxItem key={doctor.id} value={doctor}>
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate">
                            {getOptionLabel(doctor, "Doctor")}
                          </span>
                          {(
                            doctor as unknown as {
                              specialization?: string | null;
                            }
                          ).specialization ? (
                            <span className="text-muted-foreground truncate text-xs">
                              {
                                (
                                  doctor as unknown as {
                                    specialization?: string | null;
                                  }
                                ).specialization
                              }
                            </span>
                          ) : null}
                        </span>
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {renderFieldError("doctor_id")}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="appointment_date"
              >
                Appointment date
              </label>
              <Input
                id="appointment_date"
                type="date"
                value={formData.appointment_date}
                onChange={handleInputChange("appointment_date")}
              />
              {renderFieldError("appointment_date")}
            </div>

            <div className="grid gap-2">
              <label
                className="text-foreground text-sm font-medium"
                htmlFor="appointment_time"
              >
                Appointment time
              </label>
              <Input
                id="appointment_time"
                type="time"
                value={formData.appointment_time}
                onChange={handleInputChange("appointment_time")}
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
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
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
                placeholder="Routine health checkup"
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
            <Button type="submit" disabled={editingAppointment}>
              {editingAppointment ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentDialog;
