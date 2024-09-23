import { IMeta } from "../../../types/common";
import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const URL = "/friend-ship";

export const friendshipApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllFriendship: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: URL,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.Friendship],
    }),

    getSingleFriendship: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${URL}/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => ({ data: response }),
      providesTags: [tagTypes.Friendship],
    }),

    addFriendship: build.mutation({
      query: (data) => {
        return {
          url: URL,
          method: "POST",
          data: data,
        };
      },
      invalidatesTags: [tagTypes.Friendship],
    }),

    updateFriendship: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${URL}/${id}`,
          method: "PATCH",
          data: data,
        };
      },
      invalidatesTags: [tagTypes.Friendship],
    }),

    deleteFriendship: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.Friendship],
    }),
  }),
});

export const {
  useAddFriendshipMutation,
  useDeleteFriendshipMutation,
  useGetAllFriendshipQuery,
  useGetSingleFriendshipQuery,
  useUpdateFriendshipMutation,
} = friendshipApi;
