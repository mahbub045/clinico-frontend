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

export type OutcomeAnalyticsPoint = {
  outcome: string;
  total_records: number;
  total_cost: number;
  average_cost: number;
  average_satisfaction: number;
};

export type MonthlyCostAnalyticsPoint = {
  year: number;
  month: number;
  total_cost: number;
  total_records: number;
  average_cost: number;
};

export type MonthlyRecordAnalyticsPoint = {
  year: number;
  month: number;
  total_records: number;
};

export type MonthlySatisfactionAnalyticsPoint = {
  satisfaction: number;
  total_records: number;
};

export type MonthlyGenderDistributionAnalyticsPoint = {
  gender: string;
  total_records: number;
};

export type MonthlyReadmissionAnalyticsPoint = {
  readmission: string;
  total_records: number;
};

export type ProcedureAnalyticsPoint = {
  procedure: string;
  total_records: number;
  total_cost: number;
  average_cost: number;
  average_stay: number;
  average_satisfaction: number;
};
