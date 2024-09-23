import { IMeta } from "../../../types/common";
import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const URL = "/chat-messages";

export const chatmessagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllChatMessages: build.query({
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
      providesTags: [tagTypes.ChatMessages],
    }),

    getSingleChatMessages: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${URL}/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => ({ data: response }),
      providesTags: [tagTypes.ChatMessages],
    }),

    addChatMessages: build.mutation({
      query: (data) => {
        return {
          url: URL,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.ChatMessages],
    }),

    updateChatMessages: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${URL}/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.ChatMessages],
    }),

    deleteChatMessages: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.ChatMessages],
    }),
  }),
});

export const {
  useAddChatMessagesMutation,
  useDeleteChatMessagesMutation,
  useGetAllChatMessagesQuery,
  useGetSingleChatMessagesQuery,
  useUpdateChatMessagesMutation,
} = chatmessagesApi;
