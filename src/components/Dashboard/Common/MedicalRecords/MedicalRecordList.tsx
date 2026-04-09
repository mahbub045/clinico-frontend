"use client";
import { Edit, Eye, LoaderPinwheel, SearchIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
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
import { useGetMedicalRecordsQuery } from "@/redux/reducers/Common/MedicalRecords/MedicalRecordsApi";
import { useGetUserInfoQuery } from "@/redux/reducers/Common/UserInfo/UserInfoApi";
import { MedicalRecordItem } from "@/types/Common/MedicalRecords/MedicalRecordsType";
import { formatDate, getCurrencySign } from "../../../../../utils/formatters";
import CreateMedicalRecordDialog from "./Dialogs/CreateMedicalRecordDialog";
import DeleteMedicalRecordDialog from "./Dialogs/DeleteMedicalRecordDialog";
import EditMedicalRecordDialog from "./Dialogs/EditMedicalRecordDialog";

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

const MedicalRecordList: React.FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingRecord, setEditingRecord] = useState<MedicalRecordItem | null>(
    null,
  );

  const queryParams = useMemo(() => ({ search: query, page }), [query, page]);

  const { data: medicalRecords, isLoading } =
    useGetMedicalRecordsQuery(queryParams);

  const records = useMemo<MedicalRecordItem[]>(() => {
    if (!medicalRecords) return [];
    if (Array.isArray(medicalRecords))
      return medicalRecords as MedicalRecordItem[];
    if (medicalRecords.results && Array.isArray(medicalRecords.results)) {
      return medicalRecords.results as MedicalRecordItem[];
    }

    return [];
  }, [medicalRecords]);

  const currentPage = medicalRecords?.current_page ?? page;
  const totalPages = medicalRecords?.total_pages ?? 1;
  const totalItems = medicalRecords?.total_items ?? records.length;

  const paginationPages = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const pathname = usePathname();
  const dashboardRole = pathname?.split("/")[2] || "";

  const { data: userInfo } = useGetUserInfoQuery(undefined);

  return (
    <div className="card bg-card space-y-10 rounded-md p-6 shadow-sm">
      <section className="space-y-4">
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="space-y-2">
            <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
              Medical records
            </p>
            <h2 className="text-foreground text-3xl font-semibold tracking-tight">
              Patient medical history
            </h2>
            <p className="text-muted-foreground max-w-2xl text-sm leading-6">
              Review clinical records, appointment details, and treatment
              outcomes.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:max-w-sm">
              <SearchIcon className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="medical-record-search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search records..."
                className="w-full pl-10"
              />
            </div>
            <CreateMedicalRecordDialog />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <Table className="bg-card min-w-225 border text-sm shadow-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Patient</TableHead>
                <TableHead className="text-primary">Doctor</TableHead>
                <TableHead className="text-primary">Condition</TableHead>
                <TableHead className="text-primary">Procedure</TableHead>
                <TableHead className="text-primary">Outcome</TableHead>
                <TableHead className="text-primary">Cost</TableHead>
                <TableHead className="text-primary">Created</TableHead>
                <TableHead className="text-primary text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center">
                    <div className="text-muted-foreground flex items-center justify-center gap-2">
                      <LoaderPinwheel className="text-primary animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-muted-foreground py-10 text-center"
                  >
                    No medical records found.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => {
                  const patientName = [
                    record.patient_details.first_name,
                    record.patient_details.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  const doctorName = [
                    record.appointment_details.doctor_first_name,
                    record.appointment_details.doctor_last_name,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <TableRow key={record.alias}>
                      <TableCell className="text-foreground font-medium">
                        <Link
                          href={`/dashboard/${dashboardRole}/medical-records/${record.alias}`}
                          className="text-primary hover:underline"
                        >
                          {patientName || "Unknown patient"}
                        </Link>
                      </TableCell>
                      <TableCell>{doctorName || "Unknown doctor"}</TableCell>
                      <TableCell>{record.condition}</TableCell>
                      <TableCell>{record.procedure}</TableCell>
                      <TableCell>{record.outcome}</TableCell>
                      <TableCell>
                        {record.cost != null
                          ? `${getCurrencySign()} ${record.cost}`
                          : "-"}
                      </TableCell>
                      <TableCell>{formatDate(record.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <Button asChild variant="default" size="sm">
                            <Link
                              href={`/dashboard/${dashboardRole}/medical-records/${record.alias}`}
                              aria-label={`View medical record for ${patientName}`}
                            >
                              <Eye />
                            </Link>
                          </Button>
                          {userInfo && userInfo.user_type === "ADMIN" && (
                            <>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setEditingRecord(record)}
                              >
                                <Edit />
                              </Button>
                              <DeleteMedicalRecordDialog
                                alias={record.alias}
                                recordLabel={`${patientName || "This"} medical record`}
                              >
                                <Button variant="danger" size="sm">
                                  <Trash2 />
                                </Button>
                              </DeleteMedicalRecordDialog>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {editingRecord && (
          <EditMedicalRecordDialog
            key={editingRecord.alias}
            record={editingRecord}
            open={Boolean(editingRecord)}
            onOpenChange={(open) => {
              if (!open) setEditingRecord(null);
            }}
          />
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            Total records: {totalItems}.
          </p>
          {totalPages > 1 && (
            <div className="w-full overflow-x-auto sm:w-auto">
              <Pagination className="inline-flex w-full items-center justify-between gap-2">
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
                <PaginationContent className="flex flex-wrap items-center justify-center gap-2 py-1">
                  {paginationPages.map((pageNumber, index) => (
                    <PaginationItem key={`${pageNumber}-${index}`}>
                      {typeof pageNumber === "number" ? (
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
                      ) : (
                        <span className="border-border/70 bg-muted text-muted-foreground inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm">
                          …
                        </span>
                      )}
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MedicalRecordList;
