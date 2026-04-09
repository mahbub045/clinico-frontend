"use client";

import { Eye, LoaderPinwheel, SearchIcon, User } from "lucide-react";
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
import { useGetDoctorsQuery } from "@/redux/reducers/Common/Doctors/DoctorsApi";
import { useGetUserInfoQuery } from "@/redux/reducers/Common/UserInfo/UserInfoApi";
import {
  DoctorRow,
  DoctorsResponse,
  RawDoctor,
} from "@/types/Common/Doctors/DoctorsType";
import { formatChoiceFieldValue } from "../../../../../../utils/formatters";
import AddDioctorDialog from "./Dialogs/AddDioctorDialog";
import DeleteDioctorDialog from "./Dialogs/DeleteDioctorDialog";
import EditDioctorDialog from "./Dialogs/EditDioctorDialog";

const formatDoctorName = (record: RawDoctor) => {
  const firstName = record.first_name || "";
  const lastName = record.last_name || "";
  const fullName = [record.name, `${firstName} ${lastName}`]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Unknown doctor";
};

const DoctorList: React.FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: doctorsData, isLoading } = useGetDoctorsQuery({
    search: query,
    page,
  });

  const rawDoctors = useMemo<RawDoctor[]>(() => {
    if (!doctorsData) return [];

    const response = doctorsData as DoctorsResponse;

    if (Array.isArray(response)) return response;
    if (
      response &&
      typeof response === "object" &&
      Array.isArray(response.results)
    ) {
      return response.results;
    }

    return [response as RawDoctor];
  }, [doctorsData]);

  const normalizedDoctors = useMemo<DoctorRow[]>(
    () =>
      rawDoctors.map((doctor) => ({
        ...doctor,
        name: formatDoctorName(doctor),
        specialty:
          doctor.specialization ||
          doctor.specialty ||
          doctor.department ||
          "General Medicine",

        degree: doctor.degree || "N/A",
        experience: doctor.experience_years?.toString() || "-",
      })),
    [rawDoctors],
  );

  const totalPages = doctorsData?.total_pages ?? 1;
  const currentPage = doctorsData?.current_page ?? page;
  const totalItems = doctorsData?.total_items ?? normalizedDoctors.length;

  const paginationPages = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  const pathname = usePathname();
  const dashboardRole = pathname?.split("/")[2] || "";

  const { data: userInfo } = useGetUserInfoQuery(undefined);

  return (
    <div className="card bg-card border-border/70 space-y-8 rounded-3xl border p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Doctor directory
          </p>
          <h2 className="text-foreground text-3xl font-semibold tracking-tight">
            Doctor roster
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">
            Search doctors, review specialties, and manage the medical staff
            roster.
          </p>
        </div>

        <div className="grid w-full max-w-sm gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative w-full">
            <SearchIcon className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="doctor-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search doctors..."
              className="w-full pl-10"
            />
          </div>
          {userInfo?.user_type === "ADMIN" && <AddDioctorDialog />}
        </div>
      </div>

      <Table className="bg-card w-full border text-sm shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="text-primary">Name</TableHead>
            <TableHead className="text-primary">Specialty</TableHead>
            <TableHead className="text-primary">Degree</TableHead>
            <TableHead className="text-primary">Experience</TableHead>
            <TableHead className="text-primary">Email</TableHead>
            <TableHead className="text-primary">Phone</TableHead>
            <TableHead className="text-primary text-right">Actions</TableHead>
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
          ) : normalizedDoctors.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-muted-foreground py-10 text-center"
              >
                No doctors found. Try a different search term.
              </TableCell>
            </TableRow>
          ) : (
            normalizedDoctors.map((doctor, index) => (
              <TableRow key={doctor.alias ?? `${doctor.name}-${index}`}>
                <TableCell className="text-foreground font-medium">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary inline-flex h-9 w-9 items-center justify-center rounded-2xl">
                      <User className="h-4 w-4" />
                    </span>
                    <div className="space-y-0.5">
                      <Link
                        href={`/dashboard/${dashboardRole}/doctors/${doctor.alias ?? ""}`}
                        className="text-primary hover:underline"
                      >
                        {formatChoiceFieldValue(doctor.title) + " "}
                        {doctor.name}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{doctor.specialty}</TableCell>
                <TableCell>{doctor.degree}</TableCell>
                <TableCell>
                  {doctor.experience !== "-" ? `${doctor.experience} yrs` : "-"}
                </TableCell>
                <TableCell>
                  {doctor.email || (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </TableCell>
                <TableCell>
                  {doctor.phone || (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="default">
                      <Link
                        href={`/dashboard/${dashboardRole}/doctors/${doctor.alias ?? ""}`}
                      >
                        <Eye />
                      </Link>
                    </Button>
                    {userInfo?.user_type === "ADMIN" && (
                      <>
                        <EditDioctorDialog
                          alias={doctor.alias ?? ""}
                          initialValues={doctor}
                        />
                        <DeleteDioctorDialog
                          alias={doctor.alias ?? ""}
                          doctorName={doctor.name}
                        />
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          Total Doctors: {totalItems}.
        </p>
        {totalPages > 1 && (
          <Pagination className="w-full sm:w-auto">
            <PaginationPrevious
              href="#"
              className={
                currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
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
    </div>
  );
};

export default DoctorList;
