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
      query: (userInfo) => {
        console.log("🚀 ~ userInfo:", userInfo);
        return {
          url: "/auth/login",
          method: "POST",
          data: userInfo,
        };
      },
      invalidatesTags: [tagTypes.profile, tagTypes.LoginHistory],
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        data: userInfo,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        data: data,
      }),
    }),
    //
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data: data,
      }),
    }),
    setOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/set-otp",
        method: "POST",
        data: data,
      }),
    }),
    tokenToSetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/token-to-set-password",
        method: "POST",
        data: data,
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
