import { BaseApi } from "@/redux/api/BaseApi";

export const PrescriptionsApi = BaseApi.injectEndpoints({
  endpoints: (build) => ({
    getPrescriptions: build.query({
      query: (params) => ({
        url: "/api/prescriptions/",
        method: "GET",
        params,
      }),
      providesTags: ["Prescriptions"],
    }),
    getPrescriptionDetails: build.query({
      query: (alias) => ({
        url: `/api/prescriptions/${alias}/`,
      }),
      providesTags: ["Prescriptions"],
    }),
    downloadPrescription: build.mutation({
      query: (alias) => ({
        url: `/api/prescriptions/${alias}/pdf/`,
        method: "GET",
        responseHandler: async (response: Response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetPrescriptionsQuery,
  useGetPrescriptionDetailsQuery,
  useDownloadPrescriptionMutation,
} = PrescriptionsApi;
