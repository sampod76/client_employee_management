import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const CATEGORY_URL = "/category";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCategory: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: CATEGORY_URL,
          method: "GET",
          params: arg,
        };
      },

      providesTags: [tagTypes.category],
    }),

    getSingleCategory: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${CATEGORY_URL}/${id}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.category],
    }),

    addCategory: build.mutation({
      query: (data) => {
        return {
          url: CATEGORY_URL,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.category],
    }),

    updateCategory: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${CATEGORY_URL}/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: [tagTypes.category],
    }),

    deleteCategory: build.mutation({
      query: (id) => ({
        url: `${CATEGORY_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.category],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} = categoryApi;