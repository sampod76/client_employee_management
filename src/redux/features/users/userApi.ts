import { TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tag-types";

const URL = "/users";

export const usersEndPoint = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    tempSignUp: builder.mutation({
      query: (data) => ({
        url: "/users/temp-user",
        method: "POST",
        body: data,
      }),

      invalidatesTags: [tagTypes.auth],
    }),

    // get all academic departments
    getAllUsers: builder.query({
      query: (arg: Record<string, any>) => {
        return {
          url: URL,
          method: "GET",
          params: arg,
        };
      },
      transformResponse: (response: TResponseRedux<any>) => {
        // console.log(response);
        return {
          data: response.data,
          meta: response.meta,
        };
      },
      providesTags: [tagTypes.user],
    }),

    // get single academic department
    getSingleUsers: builder.query({
      query: (id: string | string[] | undefined) => ({
        url: `${URL}/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => ({ data: response }),
      providesTags: [tagTypes.user],
    }),
    // create a new academic department
    addUsers: builder.mutation({
      query: (data) => ({
        url: URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    // update ac department
    updateUsers: builder.mutation({
      query: ({ data, id }) => ({
        url: `${URL}/${id}`,
        method: "PATCH",
        body: data,
        // contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.user],
    }),

    // delete ac department
    deleteUsers: builder.mutation({
      query: (id) => ({
        url: `${URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),
    // delete ac department
    createTempUser: builder.mutation({
      query: (data) => ({
        url: `${URL}/temp-user`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    createUser: builder.mutation({
      query: (data) => {
        return {
          url: `${URL}`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddUsersMutation,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
  useGetAllUsersQuery,
  useGetSingleUsersQuery,
  //
  useCreateTempUserMutation,
} = usersEndPoint;
