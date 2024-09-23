import { IMeta } from "../../../types/common";
import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const URL = "/projects";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllProjects: build.query({
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
      providesTags: [tagTypes.Projects],
    }),

    getSingleProjects: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${URL}/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) => ({ data: response }),
      providesTags: [tagTypes.Projects],
    }),

    addProjects: build.mutation({
      query: (data) => {
        return {
          url: URL,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.Projects],
    }),

    updateProjects: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${URL}/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.Projects],
    }),

    deleteProjects: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.Projects],
    }),
  }),
});

export const {
  useAddProjectsMutation,
  useDeleteProjectsMutation,
  useGetAllProjectsQuery,
  useGetSingleProjectsQuery,
  useUpdateProjectsMutation,
} = projectsApi;
