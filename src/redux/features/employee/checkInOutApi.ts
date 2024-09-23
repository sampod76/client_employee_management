import { IMeta } from "../../../types/common";
import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const URL = "/checkin-checkout";

export const checkInOutApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCheckInOut: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: URL,
          method: "GET",
          params: arg,
          contentType: "multipart/form-data",
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.CheckInOut],
    }),

    getSingleCheckInOut: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${URL}/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => ({ data: response }),
      providesTags: [tagTypes.CheckInOut],
    }),

    addCheckIn: build.mutation({
      query: (data) => {
        return {
          url: URL + "/check-in",
          method: "POST",
          body: data,
          contentType: "multipart/form-data",
        };
      },
      invalidatesTags: [tagTypes.CheckInOut],
    }),
    addCheckOut: build.mutation({
      query: (data) => {
        return {
          url: URL + "/check-out",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.CheckInOut],
    }),

    updateCheckInOut: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${URL}/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.CheckInOut],
    }),

    deleteCheckInOut: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.CheckInOut],
    }),
  }),
});

export const {
  useAddCheckInMutation,
  useAddCheckOutMutation,
  useDeleteCheckInOutMutation,
  useGetAllCheckInOutQuery,
  useGetSingleCheckInOutQuery,
  useUpdateCheckInOutMutation,
} = checkInOutApi;
