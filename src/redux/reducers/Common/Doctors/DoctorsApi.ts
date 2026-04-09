import { BaseApi } from "@/redux/api/BaseApi";

export const DoctorsApi = BaseApi.injectEndpoints({
  endpoints: (build) => ({
    getDoctors: build.query({
      query: (params) => ({
        url: "/api/doctors/",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["Doctors"],
    }),
    getDoctorDetails: build.query({
      query: (alias) => ({
        url: `/api/doctors/${alias}/`,
        method: "GET",
      }),
      providesTags: ["Doctors"],
    }),
    addDoctor: build.mutation({
      query: (doctorData) => ({
        url: "/api/doctors/",
        method: "POST",
        body: doctorData,
      }),
      invalidatesTags: ["Doctors"],
    }),
    updateDoctor: build.mutation({
      query: ({ alias, ...doctorData }) => ({
        url: `/api/doctors/${alias}/`,
        method: "PATCH",
        body: doctorData,
      }),
      invalidatesTags: ["Doctors"],
    }),
    deleteDoctor: build.mutation({
      query: (alias) => ({
        url: `/api/doctors/${alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctors"],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorDetailsQuery,
  useAddDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = DoctorsApi;
