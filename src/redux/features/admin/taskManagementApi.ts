import { IMeta } from "../../../types/common";
import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const URL = "/task-management";

export const taskManagementApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllTaskManagement: build.query({
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
      providesTags: [tagTypes.TaskManagement],
    }),

    getSingleTaskManagement: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${URL}/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => ({ data: response }),
      providesTags: [tagTypes.TaskManagement],
    }),

    addTaskManagement: build.mutation({
      query: (data) => {
        return {
          url: URL,
          method: "POST",
          data: data,
        };
      },
      invalidatesTags: [tagTypes.TaskManagement],
    }),

    updateTaskManagement: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${URL}/${id}`,
          method: "PATCH",
          data: data,
        };
      },
      invalidatesTags: [tagTypes.TaskManagement],
    }),

    deleteTaskManagement: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.TaskManagement],
    }),
  }),
});

export const {
  useAddTaskManagementMutation,
  useDeleteTaskManagementMutation,
  useGetAllTaskManagementQuery,
  useGetSingleTaskManagementQuery,
  useUpdateTaskManagementMutation,
} = taskManagementApi;
