import { BaseApi } from "@/redux/api/BaseApi";

export const MedicalRecordAnalyticsApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedicalRecordAnalyticsCondition: builder.query({
      query: () => ({
        url: "/api/core/medical-records/analytics/condition/",
        method: "GET",
      }),
      providesTags: ["MedicalRecordSummary"],
    }),
    getMedicalRecordAnalyticsProcedure: builder.query({
      query: () => ({
        url: "/api/core/medical-records/analytics/procedure/",
        method: "GET",
      }),
      providesTags: ["MedicalRecordSummary"],
    }),
    getMedicalRecordAnalyticsOutcome: builder.query({
      query: () => ({
        url: "/api/core/medical-records/analytics/outcome/",
        method: "GET",
      }),
      providesTags: ["MedicalRecordSummary"],
    }),
    getMedicalRecordAnalyticsMonthlyCost: builder.query({
      query: () => ({
        url: "/api/core/medical-records/analytics/monthly-cost-trend/",
        method: "GET",
      }),
      providesTags: ["MedicalRecordSummary"],
    }),
    getMedicalRecordAnalyticsMonthlyRecord: builder.query({
      query: () => ({
        url: "/api/core/medical-records/analytics/monthly-record-trend/",
        method: "GET",
      }),
      providesTags: ["MedicalRecordSummary"],
    }),
  }),
});

export const {
  useGetMedicalRecordAnalyticsConditionQuery,
  useGetMedicalRecordAnalyticsProcedureQuery,
  useGetMedicalRecordAnalyticsOutcomeQuery,
  useGetMedicalRecordAnalyticsMonthlyCostQuery,
  useGetMedicalRecordAnalyticsMonthlyRecordQuery,
} = MedicalRecordAnalyticsApi;
