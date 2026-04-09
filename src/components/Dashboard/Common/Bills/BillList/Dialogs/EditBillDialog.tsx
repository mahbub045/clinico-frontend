"use client";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, LoaderPinwheel } from "lucide-react";
import { ReactNode, useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";

import {
  useEditBillMutation,
  useGetBillDetailsQuery,
} from "@/redux/reducers/Common/Bills/BillsApi";
import { useCommonAppointmentListQuery } from "@/redux/reducers/Common/CommonApis/CommonApis";
import { Appointment } from "@/types/Common/Appointments/AppointmentsType";

interface EditBillDialogProps {
  alias: string;
  children?: ReactNode;
}

interface EditBillFormState {
  appointment: Appointment | null;
  amount: number | null;
  discount: number | null;
  payment_status: string;
  payment_method: string;
  notes: string;
}

type EditBillFormAction =
  | {
      type: "reset";
      payload: EditBillFormState;
    }
  | {
      type: "update";
      key: keyof EditBillFormState;
      value: EditBillFormState[keyof EditBillFormState];
    };

const initialFormState: EditBillFormState = {
  appointment: null,
  amount: null,
  discount: null,
  payment_status: "",
  payment_method: "",
  notes: "",
};

const editBillFormReducer = (
  state: EditBillFormState,
  action: EditBillFormAction,
): EditBillFormState => {
  switch (action.type) {
    case "reset":
      return action.payload;
    case "update":
      return {
        ...state,
        [action.key]: action.value,
      };
    default:
      return state;
  }
};

const EditBillDialog: React.FC<EditBillDialogProps> = ({ alias, children }) => {
  const [open, setOpen] = useState(false);
  const [formData, dispatch] = useReducer(
    editBillFormReducer,
    initialFormState,
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  type AppointmentQueryAction = {
    type: "set";
    value: string;
  };

  const appointmentQueryReducer = (
    state: string,
    action: AppointmentQueryAction,
  ) => {
    switch (action.type) {
      case "set":
        return action.value;
      default:
        return state;
    }
  };

  const [appointmentQuery, dispatchAppointmentQuery] = useReducer(
    appointmentQueryReducer,
    "",
  );
  const [debouncedAppointmentQuery, setDebouncedAppointmentQuery] =
    useState("");
  const [appointmentPortalContainer, setAppointmentPortalContainer] =
    useState<HTMLDivElement | null>(null);

  const { data: bill, isLoading: billLoading } = useGetBillDetailsQuery(alias, {
    skip: !open,
  });
  const [editBill, { isLoading: isSaving }] = useEditBillMutation();

  const {
    data: appointmentsData,
    isLoading: appointmentsLoading,
    isFetching: appointmentsFetching,
  } = useCommonAppointmentListQuery(
    debouncedAppointmentQuery.length ? debouncedAppointmentQuery : undefined,
    { skip: !open },
  );

  const appointmentsList = Array.isArray(appointmentsData)
    ? (appointmentsData as Appointment[])
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

  const normalizeChoiceValue = (value?: string | null) =>
    value ? value.toUpperCase() : "";

  useEffect(() => {
    if (!bill) return;

    const appointment: Appointment | null = bill.appointment_details
      ? {
          id: bill.appointment,
          alias: bill.appointment_details.alias ?? null,
          slug: bill.appointment_details.slug ?? null,
          appointment_date: bill.appointment_details.appointment_date ?? null,
          appointment_time: bill.appointment_details.appointment_time ?? null,
          status: bill.appointment_details.status ?? null,
          patient: {
            full_name:
              [
                bill.appointment_details.patient_first_name,
                bill.appointment_details.patient_last_name,
              ]
                .filter(Boolean)
                .join(" ") || null,
          },
          doctor: {
            full_name:
              [
                bill.appointment_details.doctor_first_name,
                bill.appointment_details.doctor_last_name,
              ]
                .filter(Boolean)
                .join(" ") || null,
            specialization:
              bill.appointment_details.doctor_specialization ?? null,
          },
        }
      : null;

    dispatch({
      type: "reset",
      payload: {
        appointment,
        amount: bill.amount ?? null,
        discount: bill.discount ?? null,
        payment_status: normalizeChoiceValue(bill.payment_status),
        payment_method: normalizeChoiceValue(bill.payment_method),
        notes: bill.notes ?? "",
      },
    });

    if (appointment) {
      dispatchAppointmentQuery({
        type: "set",
        value: getAppointmentLabel(appointment),
      });
    }
  }, [bill]);

  const clearFieldError = (key: keyof EditBillFormState) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const handleNumberChange = (key: keyof EditBillFormState, value: string) => {
    clearFieldError(key);
    dispatch({
      type: "update",
      key,
      value: value === "" ? null : Number(value),
    });
  };

  const handleTextChange = (key: keyof EditBillFormState, value: string) => {
    clearFieldError(key);
    dispatch({
      type: "update",
      key,
      value,
    });
  };

  const renderFieldError = (field: keyof EditBillFormState) =>
    fieldErrors[field]?.map((error, idx) => (
      <p key={idx} className="text-destructive text-xs">
        {error}
      </p>
    ));

  const validate = () => {
    const errors: Record<string, string[]> = {};

    if (!formData.appointment) {
      errors.appointment = ["Appointment is required."];
    }

    if (formData.amount == null || formData.amount <= 0) {
      errors.amount = ["Amount is required and must be greater than 0."];
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const body = {
      appointment: formData.appointment?.id,
      amount: formData.amount,
      discount: formData.discount,
      payment_status: formData.payment_status || undefined,
      payment_method: formData.payment_method || undefined,
      notes: formData.notes || undefined,
    };

    try {
      await editBill({ alias, data: body }).unwrap();
      toast.success("Bill updated successfully.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to update bill", error);
      const apiErrors =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: unknown }).data
          : null;
      if (apiErrors && typeof apiErrors === "object") {
        const parsedErrors = Object.entries(
          apiErrors as Record<string, unknown>,
        ).reduce(
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
      toast.error("Unable to update bill. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="secondary" size="sm">
            <Edit />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-xl! overflow-y-auto shadow-md sm:max-w-2xl!">
        <DialogHeader>
          <DialogTitle>Edit bill</DialogTitle>
          <DialogDescription>
            Update bill details and save your changes.
          </DialogDescription>
        </DialogHeader>

        {billLoading ? (
          <div className="border-border rounded-xl border p-6 text-center">
            <div className="mx-auto flex max-w-xs flex-col items-center justify-center gap-3">
              <LoaderPinwheel className="text-primary animate-spin" />
              <p className="text-foreground">Loading bill details...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="appointment" className="text-sm font-medium">
                  Appointment <span className="text-destructive">*</span>
                </Label>
                <div ref={setAppointmentPortalContainer} />
                <Combobox
                  items={appointmentsList}
                  value={formData.appointment}
                  onValueChange={(appointment) => {
                    dispatch({
                      type: "update",
                      key: "appointment",
                      value: appointment,
                    });
                    if (appointment) {
                      dispatchAppointmentQuery({
                        type: "set",
                        value: getAppointmentLabel(appointment),
                      });
                    }
                    clearFieldError("appointment");
                  }}
                  inputValue={appointmentQuery}
                  onInputValueChange={(next) => {
                    dispatchAppointmentQuery({ type: "set", value: next });
                    if (formData.appointment) {
                      const selectedLabel = getAppointmentLabel(
                        formData.appointment,
                      );
                      if (next !== selectedLabel) {
                        dispatch({
                          type: "update",
                          key: "appointment",
                          value: null,
                        });
                      }
                    }
                  }}
                  isItemEqualToValue={(item, value) => item.id === value.id}
                  itemToStringLabel={(item) => getAppointmentLabel(item)}
                  itemToStringValue={(item) => String(item.id)}
                  disabled={appointmentsLoading}
                >
                  <ComboboxInput
                    id="appointment"
                    className="w-full"
                    placeholder={
                      appointmentsLoading || appointmentsFetching
                        ? "Searching appointments..."
                        : "Search appointment"
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
                {renderFieldError("appointment")}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount ?? ""}
                  onChange={(event) =>
                    handleNumberChange("amount", event.target.value)
                  }
                />
                {renderFieldError("amount")}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount" className="text-sm font-medium">
                  Discount
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discount ?? ""}
                  onChange={(event) =>
                    handleNumberChange("discount", event.target.value)
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="payment_status" className="text-sm font-medium">
                  Payment status
                </Label>
                <Select
                  value={formData.payment_status}
                  onValueChange={(value) =>
                    handleTextChange("payment_status", value)
                  }
                >
                  <SelectTrigger id="payment_status" className="w-full">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="PARTIAL">Partial</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="payment_method" className="text-sm font-medium">
                  Payment method
                </Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) =>
                    handleTextChange("payment_method", value)
                  }
                >
                  <SelectTrigger id="payment_method" className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                    <SelectItem value="BANK">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </Label>
                <textarea
                  id="notes"
                  rows={4}
                  className="border-input bg-background text-foreground focus:border-primary focus:ring-primary/10 w-full rounded-md border px-3 py-2 text-sm transition outline-none focus:ring-2"
                  value={formData.notes}
                  onChange={(event) =>
                    handleTextChange("notes", event.target.value)
                  }
                />
              </div>
            </div>

            <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="secondary" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditBillDialog;
