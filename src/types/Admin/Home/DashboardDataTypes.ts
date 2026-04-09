export type MedicalRecordSummaryData = {
  total_records: number;
  total_cost: number;
  average_cost: number;
  average_age: number;
  average_length_of_stay: number;
  average_satisfaction: number;
  readmission_yes_count: number;
  readmission_no_count: number;
};

export type ConditionAnalyticsPoint = {
  condition: string;
  total_records: number;
  total_cost: number;
  average_cost: number;
  average_stay: number;
  average_satisfaction: number;
};

export type ProcedureAnalyticsPoint = {
  procedure: string;
  total_records: number;
  total_cost: number;
  average_cost: number;
  average_stay: number;
  average_satisfaction: number;
};
