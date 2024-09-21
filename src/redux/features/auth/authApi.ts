import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: [tagTypes.profile],
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: [tagTypes.profile],
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        body: userInfo,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    //
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    setOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/set-otp",
        method: "POST",
        body: data,
      }),
    }),
    tokenToSetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/token-to-set-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  //
  useForgetPasswordMutation,
  useSetOtpMutation,
  useTokenToSetPasswordMutation,
} = authApi;
