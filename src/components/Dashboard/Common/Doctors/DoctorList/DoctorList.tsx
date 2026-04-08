"use client";

import {
  Eye,
  LoaderPinwheel,
  SearchIcon,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import AddDioctorDialog from "./Dialogs/AddDioctorDialog";
import DeleteDioctorDialog from "./Dialogs/DeleteDioctorDialog";
import EditDioctorDialog from "./Dialogs/EditDioctorDialog";

type RawDoctor = {
  alias?: string;
  name?: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  specialty?: string;
  department?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
  is_available?: boolean;
  [key: string]: unknown;
};

type DoctorsResponse = RawDoctor[] | { results?: RawDoctor[] } | RawDoctor;

type DoctorRow = RawDoctor & {
  name: string;
  specialty: string;
  status: string;
};

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
        specialty: doctor.specialty || doctor.department || "General",
        status:
          doctor.is_active || doctor.is_available ? "Available" : "Offline",
      })),
    [rawDoctors],
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
            <TableHead className="text-primary">Email</TableHead>
            <TableHead className="text-primary">Phone</TableHead>
            <TableHead className="text-primary">Status</TableHead>
            <TableHead className="text-primary text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center">
                <div className="text-muted-foreground flex items-center justify-center gap-2">
                  <LoaderPinwheel className="text-primary animate-spin" />
                  Loading doctors...
                </div>
              </TableCell>
            </TableRow>
          ) : normalizedDoctors.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
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
                        {doctor.name}
                      </Link>
                      <p className="text-muted-foreground text-xs">
                        {doctor.title || "Doctor"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{doctor.specialty}</TableCell>
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
                <TableCell>
                  <span className="border-border/70 text-foreground inline-flex items-center gap-2 rounded-full border bg-white/95 px-3 py-1 text-xs font-medium shadow-sm shadow-slate-950/5 dark:bg-slate-950/90 dark:text-slate-200">
                    <ShieldCheck className="text-primary h-3.5 w-3.5" />
                    {doctor.status}
                  </span>
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
                        <EditDioctorDialog />
                        <DeleteDioctorDialog />
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DoctorList;
