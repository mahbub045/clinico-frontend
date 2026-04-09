import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

export const BaseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      if (typeof window === "undefined") return headers;

      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Doctors",
    "Patients",
    "Appointments",
    "Receptionists",
    "MedicalRecords",
    "MedicalRecordSummary",
  ],
  endpoints: () => ({}),
});

export const { util: BaseApiUtil } = BaseApi;
