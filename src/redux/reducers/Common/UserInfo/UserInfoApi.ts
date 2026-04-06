import { BaseApi } from "@/redux/api/BaseApi";

export const UserInfoApi = BaseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserInfo: build.query({
      query: (params) => ({
        url: "/auth/users/me",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetUserInfoQuery, useLazyGetUserInfoQuery } = UserInfoApi;
