import { configureStore } from "@reduxjs/toolkit";

import { BaseApi } from "@/redux/api/BaseApi";
import { SignInApi } from "./api/SignInApi";

export const store = configureStore({
  reducer: {
    [BaseApi.reducerPath]: BaseApi.reducer,
    [SignInApi.reducerPath]: SignInApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(BaseApi.middleware, SignInApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
