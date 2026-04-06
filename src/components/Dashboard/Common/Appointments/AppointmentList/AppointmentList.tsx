import { Edit, Plus, SearchIcon, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const appointments = [
  {
    id: "APT-001",
    patient: "Maya Patel",
    time: "09:30 AM",
    date: "Apr 4, 2026",
    department: "Cardiology",
    status: "Confirmed",
    room: "B12",
    note: "Routine heart check",
  },
  {
    id: "APT-002",
    patient: "Noah Thompson",
    time: "10:15 AM",
    date: "Apr 4, 2026",
    department: "Dermatology",
    status: "Pending",
    room: "A09",
    note: "Follow-up on rash",
  },
  {
    id: "APT-003",
    patient: "Sara Lee",
    time: "11:00 AM",
    date: "Apr 4, 2026",
    department: "Neurology",
    status: "Confirmed",
    room: "C03",
    note: "Migraine consultation",
  },
  {
    id: "APT-004",
    patient: "Ethan Brooks",
    time: "12:30 PM",
    date: "Apr 4, 2026",
    department: "General",
    status: "Completed",
    room: "B07",
    note: "Annual physical exam",
  },
  {
    id: "APT-005",
    patient: "Lina Gomez",
    time: "02:00 PM",
    date: "Apr 4, 2026",
    department: "Pediatrics",
    status: "Confirmed",
    room: "D01",
    note: "Vaccination review",
  },
  {
    id: "APT-006",
    patient: "Oscar Wu",
    time: "03:45 PM",
    date: "Apr 4, 2026",
    department: "Orthopedics",
    status: "Cancelled",
    room: "A11",
    note: "Rescheduled for next week",
  },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "default";
    case "Pending":
      return "secondary";
    case "Completed":
      return "success";
    case "Cancelled":
      return "destructive";
    default:
      return "default";
  }
};

const AppointmentList: React.FC = () => {
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
                <TableHead className="text-primary">Date / Time</TableHead>
                <TableHead className="text-primary">Department</TableHead>
                <TableHead className="text-primary">Status</TableHead>
                <TableHead className="text-primary">Room</TableHead>
                <TableHead className="text-primary truncate">Notes</TableHead>
                <TableHead className="text-primary text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="text-foreground font-medium">
                    {appointment.patient}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-foreground font-medium">
                        {appointment.time}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {appointment.date}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.department}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{appointment.room}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {appointment.note}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        aria-label={`Edit appointment for ${appointment.patient}`}
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        aria-label={`Delete appointment for ${appointment.patient}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              All dummy appointments are shown for design preview.
            </TableCaption>
          </Table>
        </section>
      </Card>
    </div>
  );
};

export default AppointmentList;
