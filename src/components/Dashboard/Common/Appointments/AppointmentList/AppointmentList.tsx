"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAppointmentsQuery } from "@/redux/reducers/Common/Appointments/AppointmentsApi";
import { Appointment } from "@/types/Common/Appointments/AppointmentsType";
import { Edit, LoaderPinwheel, Plus, SearchIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { formatChoiceFieldValue } from "../../../../../../utils/formatters";
import DeleteAppointmentDialog from "./Dialogs/DeleteAppointmentDialog";

const statusVariant = (status: string) => {
  switch (status?.toUpperCase()) {
    case "CONFIRMED":
      return "default";
    case "PENDING":
      return "secondary";
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "destructive";
    default:
      return "default";
  }
};

const AppointmentList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {
    data: appointmentsData,
    isLoading,
    error,
  } = useGetAppointmentsQuery({ page, search });

  const appointments = useMemo<Appointment[]>(() => {
    if (!appointmentsData) return [];
    if (Array.isArray(appointmentsData))
      return appointmentsData as Appointment[];
    if (appointmentsData.results && Array.isArray(appointmentsData.results)) {
      return appointmentsData.results as Appointment[];
    }
    return [];
  }, [appointmentsData]);

  const totalPages = Math.max(1, appointmentsData?.total_pages ?? 1);
  const currentPage = appointmentsData?.current_page ?? page;
  const totalItems = appointmentsData?.total_items ?? appointments.length;
  const paginationPages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  const pathname = usePathname();
  const dashboardRole = pathname?.split("/")[2] || "";

  return (
    <div className="space-y-8">
      <Card className="rounded-md p-6 shadow-sm">
        <section className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-foreground text-sm font-semibold">
                Upcoming Appointments
              </p>
              <p className="text-muted-foreground text-sm">
                A quick view of today’s schedule and patient status.
              </p>
            </div>
            <div className="relative w-full max-w-sm">
              <SearchIcon className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="appointment-search"
                placeholder="Search appointments"
                className="w-full pl-10"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Button variant="secondary" className="justify-self-end">
              <Plus className="size-4" />
              New appointment
            </Button>
          </div>

          <Table className="border-border bg-card w-full border text-sm shadow-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Patient</TableHead>
                <TableHead className="text-primary">Doctor</TableHead>
                <TableHead className="text-primary">Date / Time</TableHead>
                <TableHead className="text-primary">Status</TableHead>
                <TableHead className="text-primary">Created by</TableHead>
                <TableHead className="text-primary truncate">Notes</TableHead>
                <TableHead className="text-primary text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <LoaderPinwheel className="text-primary animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    No appointments available.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="text-foreground font-medium">
                      <Link
                        href={`/dashboard/${dashboardRole}/appointments/${appointment.alias}`}
                        className="text-primary hover:underline"
                      >
                        {appointment.patient?.full_name ?? "Unknown patient"}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {appointment.doctor?.full_name ?? "Unknown doctor"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-foreground font-medium">
                          {appointment.appointment_time ?? "-"}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {appointment.appointment_date ?? "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(appointment.status ?? "")}>
                        {appointment.status
                          ? formatChoiceFieldValue(appointment.status)
                          : "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {appointment.created_by_details?.full_name ?? "System"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {appointment.notes || appointment.reason || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          aria-label={`Edit appointment for ${appointment.patient?.full_name ?? "patient"}`}
                        >
                          <Edit />
                        </Button>
                        <DeleteAppointmentDialog
                          alias={appointment.alias}
                          appointmentLabel={appointment.patient?.full_name}
                        >
                          <Button
                            variant="danger"
                            size="sm"
                            aria-label={`Delete appointment for ${appointment.patient?.full_name ?? "patient"}`}
                          >
                            <Trash2 />
                          </Button>
                        </DeleteAppointmentDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              Total appointments: {totalItems}.
            </p>
            {totalPages > 1 && (
              <Pagination className="w-full sm:w-auto">
                <PaginationPrevious
                  href="#"
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage > 1) setPage(currentPage - 1);
                  }}
                />
                <PaginationContent>
                  {paginationPages.map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === currentPage}
                        onClick={(event) => {
                          event.preventDefault();
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
                <PaginationNext
                  href="#"
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage < totalPages) setPage(currentPage + 1);
                  }}
                />
              </Pagination>
            )}
          </div>
        </section>
      </Card>
    </div>
  );
};

export default AppointmentList;
