"use client";

import PatientList from "./PatientList/PatientList";
import PatientsSummary from "./PatientsSummary/PatientsSummary";

const Patients: React.FC = () => {
  return (
    <>
      <PatientsSummary />
      <PatientList />
    </>
  );
};

export default Patients;
