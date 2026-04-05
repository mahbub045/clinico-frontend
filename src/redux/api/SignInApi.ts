import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const SignInApi = createApi({
  reducerPath: "signInApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ["Auth"],
  endpoints: () => ({}),
});

export const { util: SignInApiUtil } = SignInApi;
