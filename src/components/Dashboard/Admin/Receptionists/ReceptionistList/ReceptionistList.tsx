"use client";

import { Eye, SearchIcon, User } from "lucide-react";
import Link from "next/link";
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
import { useGetReceptionistsQuery } from "@/redux/reducers/Admin/Receptionists/ReceptionistsApi";
import {
  ReceptionistApiItem,
  ReceptionistRecord,
} from "@/types/Admin/Receptionists/ReceptionistsType";
import { formatChoiceFieldValue } from "../../../../../../utils/formatters";
import AddReceptionistDialog from "./Dialogs/AddReceptionistDialog";
import DeleteReceptionistDialog from "./Dialogs/DeleteReceptionistDialog";
import EditReceptionistDialog from "./Dialogs/EditReceptionistDialog";

const ReceptionistList: React.FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data: receptionistsResponse, isLoading } = useGetReceptionistsQuery({
    search: query,
    page,
  });

  const receptionists: ReceptionistRecord[] = useMemo(() => {
    const results = (receptionistsResponse?.results ??
      []) as ReceptionistApiItem[];
    return results.map((item) => ({
      alias: item.alias,
      title: item.title,
      name: `${item.first_name} ${item.last_name}`,
      email: item.email,
      phone: item.phone,
      branch: item.suburb,
    }));
  }, [receptionistsResponse]);

  const currentPage = receptionistsResponse?.current_page ?? page;
  const totalPages = receptionistsResponse?.total_pages ?? 1;
  const totalItems = receptionistsResponse?.total_items ?? receptionists.length;

  const paginationPages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const getRawReceptionist = (alias: string): ReceptionistApiItem | undefined =>
    (receptionistsResponse?.results ?? []).find(
      (item: ReceptionistApiItem) => item.alias === alias,
    );

  const filteredReceptionists = useMemo(
    () =>
      receptionists.filter((item) =>
        [item.name, item.email, item.branch]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, receptionists],
  );

  return (
    <div className="card bg-card border-border/70 space-y-8 rounded-3xl border p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
            Receptionist directory
          </p>
          <h2 className="text-foreground text-3xl font-semibold tracking-tight">
            Manage reception staff
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm leading-6">
            Search the front desk team, review contact details, and keep
            receptionist profiles up to date.
          </p>
        </div>

        <div className="grid w-full max-w-sm gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative w-full">
            <SearchIcon className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="receptionist-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search receptionists..."
              className="w-full pl-10"
            />
          </div>
          <AddReceptionistDialog />
        </div>
      </div>

      <Table className="bg-card w-full border text-sm shadow-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="text-primary">Name</TableHead>
            <TableHead className="text-primary">Email</TableHead>
            <TableHead className="text-primary">Phone</TableHead>
            <TableHead className="text-primary">Branch</TableHead>
            <TableHead className="text-primary text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-muted-foreground py-10 text-center"
              >
                Loading receptionists...
              </TableCell>
            </TableRow>
          ) : filteredReceptionists.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-muted-foreground py-10 text-center"
              >
                No receptionists match your search. Try another keyword.
              </TableCell>
            </TableRow>
          ) : (
            filteredReceptionists.map((receptionist) => (
              <TableRow key={receptionist.alias}>
                <TableCell className="text-foreground font-medium">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary inline-flex h-9 w-9 items-center justify-center rounded-2xl">
                      <User className="h-4 w-4" />
                    </span>
                    <div className="space-y-0.5">
                      <Link
                        href={`/dashboard/admin/receptionists/${receptionist.alias}`}
                        className="text-primary hover:underline"
                      >
                        {formatChoiceFieldValue(receptionist.title) + " "}
                        {receptionist.name}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{receptionist.email}</TableCell>
                <TableCell>{receptionist.phone}</TableCell>
                <TableCell>{receptionist.branch}</TableCell>

                <TableCell className="text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <Button asChild size="sm" variant="default">
                      <Link
                        href={`/dashboard/admin/receptionists/${receptionist.alias}`}
                      >
                        <Eye />
                      </Link>
                    </Button>
                    {getRawReceptionist(receptionist.alias) ? (
                      <EditReceptionistDialog
                        alias={receptionist.alias}
                        initialValues={getRawReceptionist(receptionist.alias)!}
                      />
                    ) : null}
                    <DeleteReceptionistDialog
                      alias={receptionist.alias}
                      receptionistName={receptionist.name}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          Total Receptionists: {totalItems}.
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

export default ReceptionistList;
