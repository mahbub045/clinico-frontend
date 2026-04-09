"use client";

import { Edit, Eye, LoaderPinwheel, SearchIcon, Trash } from "lucide-react";
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
import { useGetBillsQuery } from "@/redux/reducers/Common/Bills/BillsApi";
import { useGetUserInfoQuery } from "@/redux/reducers/Common/UserInfo/UserInfoApi";
import { BillItem } from "@/types/Common/Bills/BillsType";
import {
  formatChoiceFieldValue,
  formatDate,
  getCurrencySign,
} from "../../../../../../utils/formatters";
import DeleteBillDialog from "./Dialogs/DeleteBillDialog";
import EditBillDialog from "./Dialogs/EditBillDialog";
import MakeBillDialog from "./Dialogs/MakeBillDialog";

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

const statusVariant = (status?: string | null) => {
  switch (status?.toUpperCase()) {
    case "PAID":
      return "success";
    case "PARTIAL":
      return "warning";
    case "PENDING":
      return "secondary";
    case "CANCELLED":
      return "destructive";
    default:
      return "default";
  }
};

const BillList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const queryParams = useMemo(() => ({ search, page }), [search, page]);
  const { data: billsData, isLoading } = useGetBillsQuery(queryParams);

  const bills = useMemo<BillItem[]>(() => {
    if (!billsData) return [];
    if (Array.isArray(billsData)) return billsData as BillItem[];
    if (billsData.results && Array.isArray(billsData.results)) {
      return billsData.results as BillItem[];
    }
    return [];
  }, [billsData]);

  const currentPage = billsData?.current_page ?? page;
  const totalPages = Math.max(1, billsData?.total_pages ?? 1);
  const totalItems = billsData?.total_items ?? bills.length;
  const paginationPages = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const pathname = usePathname();
  const dashboardRole = pathname?.split("/")[2] || "";

  const { data: userInfo } = useGetUserInfoQuery(undefined);
  const isReceptionist = userInfo?.user_type === "RECEPTIONIST";

  return (
    <div className="space-y-8">
      <Card className="rounded-md p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-primary text-sm font-semibold tracking-[0.24em] uppercase">
              Bills
            </p>
            <h2 className="text-foreground text-3xl font-semibold tracking-tight">
              Bill management
            </h2>
            <p className="text-muted-foreground max-w-2xl text-sm leading-6">
              Search recent bills, review payments, and inspect appointment
              details.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <SearchIcon className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="bill-search"
                className="w-full pl-10"
                placeholder="Search bills.."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            {isReceptionist && <MakeBillDialog />}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="bg-card min-w-240 border text-sm shadow-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary">Bill</TableHead>
                <TableHead className="text-primary">Patient</TableHead>
                <TableHead className="text-primary">Doctor</TableHead>
                <TableHead className="text-primary">Amount</TableHead>
                <TableHead className="text-primary">Status</TableHead>
                <TableHead className="text-primary">Method</TableHead>
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
                      Loading bills...
                    </div>
                  </TableCell>
                </TableRow>
              ) : bills.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    No bills found.
                  </TableCell>
                </TableRow>
              ) : (
                bills.map((bill: BillItem) => {
                  const patientName = [
                    bill.appointment_details?.patient_first_name,
                    bill.appointment_details?.patient_last_name,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  const doctorName = [
                    bill.appointment_details?.doctor_first_name,
                    bill.appointment_details?.doctor_last_name,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  const createdAt = formatDate(bill.created_at);

                  return (
                    <TableRow key={bill.alias ?? bill.id}>
                      <TableCell className="text-foreground font-medium">
                        <Link
                          href={`/dashboard/${dashboardRole}/bills/${bill.alias}`}
                          className="text-primary hover:underline"
                        >
                          {bill.bill_number || bill.slug || "—"}
                        </Link>
                      </TableCell>
                      <TableCell>{patientName || "Unknown patient"}</TableCell>
                      <TableCell>{doctorName || "Unknown doctor"}</TableCell>
                      <TableCell>
                        {getCurrencySign()}
                        {bill.total_amount?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(bill.payment_status)}>
                          {formatChoiceFieldValue(bill.payment_status ?? "")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatChoiceFieldValue(bill.payment_method)}
                      </TableCell>
                      <TableCell>{createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="default" size="sm">
                            <Link
                              href={`/dashboard/${dashboardRole}/bills/${bill.alias}`}
                            >
                              <Eye />
                            </Link>
                          </Button>

                          {isReceptionist && (
                            <>
                              <EditBillDialog alias={bill.alias}>
                                <Button variant="secondary" size="sm">
                                  <Edit />
                                </Button>
                              </EditBillDialog>
                              <DeleteBillDialog
                                alias={bill.alias}
                                billLabel={bill.bill_number || bill.slug}
                              >
                                <Button variant="danger" size="sm">
                                  <Trash />
                                </Button>
                              </DeleteBillDialog>
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            Total bills: {totalItems}.
          </p>

          {totalPages > 1 && (
            <div className="w-full overflow-x-auto sm:w-auto">
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
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BillList;
