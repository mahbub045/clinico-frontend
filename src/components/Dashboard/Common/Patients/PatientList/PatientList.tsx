"use client";

import {
  Edit,
  Eye,
  LoaderPinwheel,
  SearchIcon,
  Trash,
  User,
} from "lucide-react";
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
import { useGetPatientsQuery } from "@/redux/reducers/Common/Patients/PatientsApi";
import {
  AddPatientPayload,
  RawPatient,
} from "@/types/Common/Patients/PatientsType";
import { formatChoiceFieldValue } from "../../../../../../utils/formatters";
import AddPatientDialog from "./Dialogs/AddPatientDialog";
import DeletePatientDialog from "./Dialogs/DeletePatientDialog";
import EditPatietDialog from "./Dialogs/EditPatietDialog";

const formatAge = (dateOfBirth?: string | null) => {
  if (!dateOfBirth) return "-";
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "-";

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age -= 1;
  }

  return `${age}`;
};

const normalizePatient = (
  patient: RawPatient,
): RawPatient & { name: string; age: string; last_visit: string } => {
  const name = [
    formatChoiceFieldValue(patient.title),
    patient.first_name,
    patient.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    ...patient,
    name: name || "Unknown patient",
    age: formatAge(patient.date_of_birth),
    last_visit: patient.last_visit || "-",
  };
};

const PatientList: React.FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: patientsData, isLoading } = useGetPatientsQuery({
    search: query,
    page,
  });

  const rawPatients = useMemo(() => {
    if (!patientsData) return [];
    if (Array.isArray(patientsData)) return patientsData as RawPatient[];
    if (patientsData.results && Array.isArray(patientsData.results)) {
      return patientsData.results as RawPatient[];
    }
    return [patientsData as RawPatient];
  }, [patientsData]);

  const normalizedPatients = useMemo(
    () => rawPatients.map(normalizePatient),
    [rawPatients],
  );

  const pathname = usePathname();
  const dashboardRole = pathname?.split("/")[2] || "";

  const totalPages = patientsData?.total_pages ?? 1;
  const currentPage = patientsData?.current_page ?? page;
  const totalItems = patientsData?.total_items ?? normalizedPatients.length;

  const paginationPages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return (
    <div className="card bg-card space-y-10 rounded-md p-6 shadow-sm">
      <section className="space-y-4">
        <div className="grid w-full grid-cols-[1fr_auto] gap-3">
          <div className="relative w-sm">
            <SearchIcon className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="patient-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search patients..."
              className="w-full pl-10"
            />
          </div>
          <AddPatientDialog />
        </div>
        <Table className="bg-card w-full border text-sm shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="text-primary">Name</TableHead>
              <TableHead className="text-primary">Age</TableHead>
              <TableHead className="text-primary">Gender</TableHead>
              <TableHead className="text-primary">Email</TableHead>
              <TableHead className="text-primary">Phone</TableHead>
              <TableHead className="text-primary">Last visit</TableHead>
              <TableHead className="text-primary text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  <div className="text-muted-foreground flex items-center justify-center gap-2">
                    <LoaderPinwheel className="text-primary animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              normalizedPatients.map((patient, index) => (
                <TableRow key={patient.alias ?? patient.email ?? index}>
                  <TableCell className="text-foreground font-medium">
                    <div className="flex items-center gap-3">
                      <span className="bg-primary/10 text-primary inline-flex h-9 w-9 items-center justify-center rounded-2xl">
                        <User className="size-4" />
                      </span>
                      <div className="space-y-0.5">
                        <Link
                          href={`/dashboard/${dashboardRole}/patients/${patient.alias}`}
                          className="text-primary hover:underline"
                        >
                          {patient.name}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.age !== "-" ? (
                      patient.age
                    ) : (
                      <small className="text-muted-foreground">
                        Not provided
                      </small>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatChoiceFieldValue(patient.gender || "") ? (
                      formatChoiceFieldValue(patient.gender || "")
                    ) : (
                      <small className="text-muted-foreground">
                        Not specified
                      </small>
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.email ? (
                      patient.email
                    ) : (
                      <small className="text-muted-foreground">
                        Not provided
                      </small>
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.phone ? (
                      patient.phone
                    ) : (
                      <small className="text-muted-foreground">
                        Not provided
                      </small>
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.last_visit !== "-" ? (
                      patient.last_visit
                    ) : (
                      <small className="text-muted-foreground">
                        Not provided
                      </small>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <Button asChild variant="default" size="sm">
                        <Link
                          href={`/dashboard/${dashboardRole}/patients/${patient.alias}`}
                        >
                          <Eye />
                        </Link>
                      </Button>
                      <EditPatietDialog
                        alias={patient.alias ?? ""}
                        initialValues={
                          (patient as RawPatient &
                            Partial<AddPatientPayload>) ?? {}
                        }
                      >
                        <Button variant="secondary" size="sm">
                          <Edit />
                        </Button>
                      </EditPatietDialog>
                      <DeletePatientDialog
                        alias={patient.alias ?? ""}
                        patientName={patient.name || "Not provided"}
                      >
                        <Button variant="danger" size="sm">
                          <Trash />
                        </Button>
                      </DeletePatientDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            Total Patients: {totalItems}.
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
    </div>
  );
};

export default PatientList;
