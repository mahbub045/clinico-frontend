import { BaseApi } from "@/redux/api/BaseApi";

export const MedicalRecordSummaryApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedicalRecordSummary: builder.query({
        query: () => ({
            url: "/api/core/medical-records/dashboard/",
            method: "GET",
        }),
        providesTags: ["MedicalRecordSummary"],
    }),
  }),
});

export const { useGetMedicalRecordSummaryQuery } = MedicalRecordSummaryApi;