"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoaderPinwheel } from "lucide-react";
import { useParams } from "next/navigation";

import { useGetBillDetailsQuery } from "@/redux/reducers/Common/Bills/BillsApi";
import {
  formatChoiceFieldValue,
  formatDateAndTime,
  getCurrencySign,
} from "../../../../../../utils/formatters";

const statusVariant = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "PAID":
      return "success";
    case "PENDING":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    case "REFUNDED":
      return "warning";
    default:
      return "default";
  }
};

const paymentMethodVariant = (method?: string) => {
  switch (method?.toUpperCase()) {
    case "CARD":
      return "secondary";
    case "CASH":
      return "default";
    case "INSURANCE":
      return "success";
    default:
      return "default";
  }
};

const getFullName = (first?: string, last?: string) => {
  const name = [first, last].filter(Boolean).join(" ");
  return name || "Unknown";
};

const formatCurrency = (value?: number) => {
  if (value == null || Number.isNaN(value)) {
    return "-";
  }
  return `${getCurrencySign()}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const BillDetails: React.FC = () => {
  const { alias } = useParams() as { alias?: string };
  const {
    data: bill,
    isLoading,
    error,
  } = useGetBillDetailsQuery(alias ?? "", {
    skip: !alias,
  });

  if (isLoading) {
    return (
      <Card className="border-border rounded-xl border p-6 text-center">
        <div className="mx-auto flex max-w-xs flex-col items-center justify-center gap-3">
          <LoaderPinwheel className="text-primary animate-spin" />
          <p className="text-foreground">Loading bill details...</p>
        </div>
      </Card>
    );
  }

  if (error || !bill) {
    return (
      <Card className="border-destructive/50 bg-destructive/5 text-destructive rounded-xl border p-6 text-center">
        <p className="text-foreground">Unable to load bill details.</p>
        <p className="text-muted-foreground mt-2">
          Please refresh the page or try again later.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">
            Bill details
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Review the invoice, appointment, patient and payment details for
            this bill.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="border-border rounded-xl border p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-sm">Bill</p>
              <p className="text-foreground text-lg font-semibold">
                {bill.bill_number ?? bill.slug ?? bill.alias}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">Payment status</p>
                <Badge variant={statusVariant(bill.payment_status)}>
                  {formatChoiceFieldValue(bill.payment_status) || "Unknown"}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Payment method</p>
                <Badge variant={paymentMethodVariant(bill.payment_method)}>
                  {formatChoiceFieldValue(bill.payment_method) || "Unknown"}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Amount</p>
                <p className="text-foreground">{formatCurrency(bill.amount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Discount</p>
                <p className="text-foreground">
                  {formatCurrency(bill.discount)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Tax</p>
                <p className="text-foreground">{formatCurrency(bill.tax)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total amount</p>
                <p className="text-foreground font-semibold">
                  {formatCurrency(bill.total_amount)}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm">Created</p>
                <p className="text-foreground">
                  {formatDateAndTime(bill.created_at)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Updated</p>
                <p className="text-foreground">
                  {formatDateAndTime(bill.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-border rounded-xl border p-6 shadow-sm">
            <h2 className="text-foreground text-lg font-semibold">
              Appointment details
            </h2>
            <div className="grid gap-4 pt-4">
              <div>
                <p className="text-muted-foreground text-sm">Appointment</p>
                <p className="text-foreground">
                  {bill.appointment_details?.appointment_date || "-"}
                  {bill.appointment_details?.appointment_time
                    ? ` · ${bill.appointment_details.appointment_time}`
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">
                  Appointment status
                </p>
                <p className="text-foreground">
                  {formatChoiceFieldValue(bill.appointment_details?.status) ||
                    "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Patient</p>
                <p className="text-foreground">
                  {getFullName(
                    bill.appointment_details?.patient_first_name,
                    bill.appointment_details?.patient_last_name,
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Patient email</p>
                <p className="text-foreground">
                  {bill.appointment_details?.patient_email || "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Doctor</p>
                <p className="text-foreground">
                  {getFullName(
                    bill.appointment_details?.doctor_first_name,
                    bill.appointment_details?.doctor_last_name,
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Specialization</p>
                <p className="text-foreground">
                  {bill.appointment_details?.doctor_specialization || "-"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-border rounded-xl border p-6 shadow-sm">
        <h2 className="text-foreground text-lg font-semibold">Notes</h2>
        <p className="text-muted-foreground mt-2 whitespace-pre-line">
          {bill.notes || "No notes available."}
        </p>
      </Card>
    </div>
  );
};

export default BillDetails;
