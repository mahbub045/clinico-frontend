import { BaseApi } from "@/redux/api/BaseApi";

export const ReceptionistsApi = BaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReceptionists: builder.query({
      query: (params) => ({
        url: "/api/receptionists/",
        method: "GET",
        params,
      }),
      providesTags: ["Receptionists"],
    }),
    getReceptionistDetails: builder.query({
      query: (alias) => ({
        url: `/api/receptionists/${alias}/`,
        method: "GET",
      }),
      providesTags: ["Receptionists"],
    }),
    addReceptionist: builder.mutation({
      query: (data) => ({
        url: "/api/receptionists/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Receptionists"],
    }),
    editReceptionist: builder.mutation({
      query: ({ alias, ...data }) => ({
        url: `/api/receptionists/${alias}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Receptionists"],
    }),
    deleteReceptionist: builder.mutation({
      query: (alias) => ({
        url: `/api/receptionists/${alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Receptionists"],
    }),
  }),
});

export const {
  useGetReceptionistsQuery,
  useGetReceptionistDetailsQuery,
  useAddReceptionistMutation,
  useEditReceptionistMutation,
  useDeleteReceptionistMutation,
} = ReceptionistsApi;
