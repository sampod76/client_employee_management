import { IMeta } from '../../../types/common';
import { baseApi } from '../../api/baseApi';
import { tagTypes } from '../../tag-types';

const URL = '/employee';

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllEmployee: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: URL,
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.Employee],
    }),
    getEmployeeDashboard: build.query({
      query: (arg: Record<string, any>) => {
        return {
          url: URL + '/dashboard',
          method: 'GET',
          params: arg,
        };
      },
      transformResponse: (response: any, meta: IMeta) => {
        return {
          data: response,
          meta,
        };
      },
      providesTags: [tagTypes.Employee],
    }),

    getSingleEmployee: build.query({
      query: (id: string | string[] | undefined) => {
        return {
          url: `${URL}/${id}`,
          method: 'GET',
        };
      },
      transformResponse: (response: any) => ({ data: response }),
      providesTags: [tagTypes.Employee],
    }),

    addEmployee: build.mutation({
      query: (data) => {
        return {
          url: URL,
          method: 'POST',
          data: data,
        };
      },
      invalidatesTags: [tagTypes.Employee],
    }),

    updateEmployee: build.mutation({
      query: ({ data, id }) => {
        return {
          url: `${URL}/${id}`,
          method: 'PATCH',
          data: data,
          contentType: 'multipart/form-data',
        };
      },
      invalidatesTags: [tagTypes.Employee],
    }),

    deleteEmployee: build.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [tagTypes.Employee],
    }),
  }),
});

export const {
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetAllEmployeeQuery,
  useGetSingleEmployeeQuery,
  useUpdateEmployeeMutation,
  //
  useGetEmployeeDashboardQuery,
} = employeeApi;
