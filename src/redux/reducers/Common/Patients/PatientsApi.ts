import { BaseApi } from "@/redux/api/BaseApi";

export const PatientsApi = BaseApi.injectEndpoints({
  endpoints: (build) => ({
    getPatients: build.query({
      query: (params) => ({
        url: "/api/patients/",
        method: "GET",
        params,
      }),
      providesTags: ["Patients"],
    }),
    getPatientDetails: build.query({
      query: ({alias}) => ({
        url: `/api/patients/${alias}/`,
        method: "GET",
      }),
      providesTags: ["Patients"],
    }),
    addPatient: build.mutation({
      query: (data) => ({
        url: "/api/patients/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Patients"],
    }),
    editPatient: build.mutation({
      query: ({ alias, ...data }) => ({
        url: `/api/patients/${alias}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Patients"],
    }),
    deletePatient: build.mutation({
      query: (alias) => ({
        url: `/api/patients/${alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patients"],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientDetailsQuery,
  useAddPatientMutation,
  useEditPatientMutation,
  useDeletePatientMutation,
} = PatientsApi;
