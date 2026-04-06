"use client";

import { Edit, Plus, SearchIcon, Trash, User } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
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

const patients = [
  {
    id: "PAT-001",
    name: "Amina Hassan",
    age: 32,
    gender: "Female",
    lastVisit: "Mar 28, 2026",
    status: "Active",
    doctor: "Dr. Martin",
  },
  {
    id: "PAT-002",
    name: "Daniel Park",
    age: 47,
    gender: "Male",
    lastVisit: "Mar 30, 2026",
    status: "Follow-up",
    doctor: "Dr. Nguyen",
  },
  {
    id: "PAT-003",
    name: "Lucia Fernandez",
    age: 29,
    gender: "Female",
    lastVisit: "Apr 1, 2026",
    status: "New",
    doctor: "Dr. Martin",
  },
  {
    id: "PAT-004",
    name: "Tom Walker",
    age: 54,
    gender: "Male",
    lastVisit: "Mar 26, 2026",
    status: "Active",
    doctor: "Dr. Patel",
  },
  {
    id: "PAT-005",
    name: "Nina Kapoor",
    age: 38,
    gender: "Female",
    lastVisit: "Apr 2, 2026",
    status: "Referral",
    doctor: "Dr. Patel",
  },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Active":
      return "success";
    case "Follow-up":
      return "secondary";
    case "New":
      return "default";
    case "Referral":
      return "warning";
    default:
      return "default";
  }
};

const PatientList: React.FC = () => {
  const [query, setQuery] = useState("");

  const filteredPatients = useMemo(
    () =>
      patients.filter((patient) =>
        [patient.name, patient.gender, patient.doctor, patient.status]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
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
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patients, status, or doctor"
              className="w-full pl-10"
            />
          </div>
          <Button variant="secondary">
            <Plus className="size-4" />
            New patient
          </Button>
        </div>
        <Table className="border-border bg-card w-full border text-sm shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="text-primary">Name</TableHead>
              <TableHead className="text-primary">Age</TableHead>
              <TableHead className="text-primary">Gender</TableHead>
              <TableHead className="text-primary">Last visit</TableHead>
              <TableHead className="text-primary">Doctor</TableHead>
              <TableHead className="text-primary">Status</TableHead>
              <TableHead className="text-primary text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="text-foreground font-medium">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary inline-flex h-9 w-9 items-center justify-center rounded-2xl">
                      <User className="size-4" />
                    </span>
                    <div className="space-y-0.5">
                      <div>{patient.name}</div>
                      <div className="text-muted-foreground text-xs">
                        {patient.id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>{patient.doctor}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(patient.status)}>
                    {patient.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <Button variant="secondary" size="sm">
                      <Edit />
                    </Button>
                    <Button variant="danger" size="sm">
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <p className="text-muted-foreground text-sm">
          Showing patients that match your current search. Refine search to
          update results.
        </p>
      </section>
    </div>
  );
};

export default PatientList;
