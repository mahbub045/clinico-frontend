import { BaseApi } from "@/redux/api/BaseApi";

export const BillsApi = BaseApi.injectEndpoints({
  endpoints: (build) => ({
    getBills: build.query({
      query: (params) => ({
        url: "/api/bills/",
        method: "GET",
        params,
      }),
      providesTags: ["Bills"],
    }),
    getBillDetails: build.query({
      query: (alias) => ({
        url: `/api/bills/${alias}/`,
      }),
      providesTags: ["Bills"],
    }),
    createBill: build.mutation({
      query: (data) => ({
        url: "/api/bills/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bills"],
    }),
    editBill: build.mutation({
      query: ({ alias, data }) => ({
        url: `/api/bills/${alias}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Bills"],
    }),
    deleteBill: build.mutation({
      query: (alias) => ({
        url: `/api/bills/${alias}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bills"],
    }),
    getBillOverview: build.query({
      query: () => ({
        url: "/api/bills/dashboard/",
        method: "GET",
      }),
      providesTags: ["Bills"],
    }),
  }),
});

export const {
  useGetBillsQuery,
  useGetBillDetailsQuery,
  useCreateBillMutation,
  useEditBillMutation,
  useDeleteBillMutation,
  useGetBillOverviewQuery,
} = BillsApi;
