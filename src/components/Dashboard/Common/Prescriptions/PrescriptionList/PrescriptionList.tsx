"use client";

import { Eye, LoaderPinwheel, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

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
import { useGetPrescriptionsQuery } from "@/redux/reducers/Common/Prescriptions/PrescriptionsApi";
import { PrescriptionItem } from "@/types/Common/Prescriptions/PrescriptionsType";
import { formatDate } from "../../../../../../utils/formatters";

const getPaginationRange = (currentPage: number, totalPages: number) => {
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const range: Array<number | string> = [1];
  const leftBound = Math.max(2, currentPage - 2);
  const rightBound = Math.min(totalPages - 1, currentPage + 2);

  if (leftBound > 2) {
    range.push("left-ellipsis");
  }

  for (let page = leftBound; page <= rightBound; page += 1) {
    range.push(page);
  }

  if (rightBound < totalPages - 1) {
    range.push("right-ellipsis");
  }

  range.push(totalPages);
  return range;
};

const statusVariant = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    case "CONFIRMED":
      return "default";
    default:
      return "default";
  }
};

const PrescriptionList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = useMemo(() => ({ search, page }), [search, page]);

  const { data: prescriptionsData, isLoading } =
    useGetPrescriptionsQuery(queryParams);

  const prescriptions = useMemo<PrescriptionItem[]>(() => {
    if (!prescriptionsData) return [];
    if (Array.isArray(prescriptionsData)) return prescriptionsData;
    if (prescriptionsData.results && Array.isArray(prescriptionsData.results)) {
      return prescriptionsData.results as PrescriptionItem[];
    }
    return [];
  }, [prescriptionsData]);

  const currentPage = prescriptionsData?.current_page ?? page;
  const totalPages = Math.max(1, prescriptionsData?.total_pages ?? 1);
  const totalItems = prescriptionsData?.total_items ?? prescriptions.length;

  const paginationPages = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const pathname = usePathname();
  const dashboardRole = pathname?.split("/")[2] || "";

  return (
    <div className="space-y-8">
      <Card className="rounded-md p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
              Prescriptions
            </p>
            <h2 className="text-foreground text-3xl font-semibold tracking-tight">
              Prescription management
            </h2>
            <p className="text-muted-foreground max-w-2xl text-sm leading-6">
              Browse recent prescriptions, appointment details, and treatment
              guidance from your clinic records.
            </p>
          </div>

          <div className="relative w-full max-w-sm">
            <SearchIcon className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="prescription-search"
              className="w-full pl-10"
              placeholder="Search prescriptions"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="bg-card min-w-225 border text-sm shadow-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Prescription</TableHead>
                <TableHead className="text-primary">Patient</TableHead>
                <TableHead className="text-primary">Doctor</TableHead>
                <TableHead className="text-primary">Diagnosis</TableHead>
                <TableHead className="text-primary">Medicines</TableHead>
                <TableHead className="text-primary">Status</TableHead>
                <TableHead className="text-primary">Created</TableHead>
                <TableHead className="text-primary text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    <div className="inline-flex items-center justify-center gap-2">
                      <LoaderPinwheel className="text-primary h-5 w-5 animate-spin" />
                      Loading prescriptions...
                    </div>
                  </TableCell>
                </TableRow>
              ) : prescriptions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    No prescriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                prescriptions.map((prescription: PrescriptionItem) => {
                  const patientName = [
                    prescription.appointment_details?.patient_first_name,
                    prescription.appointment_details?.patient_last_name,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  const doctorName = [
                    prescription.appointment_details?.doctor_first_name,
                    prescription.appointment_details?.doctor_last_name,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  const medicinesPreview = prescription.medicines
                    ? String(prescription.medicines).split("\n")[0]
                    : "-";

                  return (
                    <TableRow key={prescription.alias ?? prescription.id}>
                      <TableCell className="text-foreground font-medium">
                        <Link
                          href={`/dashboard/${dashboardRole}/prescriptions/${prescription.alias}`}
                          className="text-primary hover:underline"
                        >
                          {prescription.prescription_number ||
                            prescription.slug ||
                            "—"}
                        </Link>
                      </TableCell>
                      <TableCell>{patientName || "Unknown patient"}</TableCell>
                      <TableCell>{doctorName || "Unknown doctor"}</TableCell>
                      <TableCell>{prescription.diagnosis || "—"}</TableCell>
                      <TableCell className="text-muted-foreground max-w-60 truncate">
                        {medicinesPreview}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusVariant(
                            prescription.appointment_details?.status,
                          )}
                        >
                          {prescription.appointment_details?.status ??
                            "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(prescription.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="default" size="sm">
                          <Link
                            href={`/dashboard/${dashboardRole}/prescriptions/${prescription.alias}`}
                            aria-label={`View prescription ${prescription.prescription_number}`}
                          >
                            <Eye />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            Total prescriptions: {totalItems}.
          </p>

          {totalPages > 1 && (
            <Pagination className="inline-flex w-full items-center justify-between gap-2 sm:w-auto">
              <PaginationPrevious
                href="#"
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
                onClick={() => {
                  if (currentPage > 1) setPage(currentPage - 1);
                }}
              >
                Previous
              </PaginationPrevious>
              <PaginationContent className="flex flex-wrap items-center justify-center gap-2 py-1">
                {paginationPages.map((pageNumber, index) => (
                  <PaginationItem key={`${pageNumber}-${index}`}>
                    {pageNumber === "left-ellipsis" ||
                    pageNumber === "right-ellipsis" ? (
                      <span className="text-muted-foreground px-3 text-sm">
                        …
                      </span>
                    ) : (
                      <PaginationLink
                        href="#"
                        className={
                          pageNumber === currentPage
                            ? "bg-primary text-white"
                            : ""
                        }
                        onClick={() => {
                          if (typeof pageNumber === "number") {
                            setPage(pageNumber);
                          }
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
              </PaginationContent>
              <PaginationNext
                href="#"
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
                onClick={() => {
                  if (currentPage < totalPages) setPage(currentPage + 1);
                }}
              >
                Next
              </PaginationNext>
            </Pagination>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PrescriptionList;
