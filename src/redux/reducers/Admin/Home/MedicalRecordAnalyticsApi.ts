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
  }),
});

export const {
  useGetMedicalRecordAnalyticsConditionQuery,
  useGetMedicalRecordAnalyticsProcedureQuery,
} = MedicalRecordAnalyticsApi;
