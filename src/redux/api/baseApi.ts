/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../helpers/axios/axiosBaseQuery";
import { getBaseUrl } from "../../helpers/config/envConfig";
import { tagTypesList } from "../tag-types";

// const baseQuery = fetchBaseQuery({
//   baseUrl: getBaseUrl,
//   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth.token;

//     if (token) {
//       headers.set("authorization", `${token}`);
//     }

//     return headers;
//   },
// });

// const baseQueryWithRefreshToken: BaseQueryFn<
//   FetchArgs,
//   BaseQueryApi,
//   DefinitionType
// > = async (args, api, extraOptions): Promise<any> => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result?.error?.status !== 401) {
//     //@ts-ignore
//     toast.error(result?.error?.data?.message);
//   }
//   // if (result?.error?.status === 403) {
//   //   toast.error(result?.error?.data.message);
//   // }
//   if (result?.error?.status === 401) {
//     //* Send Refresh
//     console.log("Sending refresh token");

//     const res = await fetch(`${getBaseUrl}/auth/refresh-token`, {
//       method: "POST",
//       credentials: "include",
//     });

//     const data = await res.json();

//     if (data?.data?.accessToken) {
//       const user = (api.getState() as RootState).auth.user;

//       api.dispatch(
//         setUser({
//           user,
//           token: data.data.accessToken,
//         })
//       );

//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logout());
//     }
//   }

//   return result;
// };

export const baseApi = createApi({
  // reducerPath: "baseApi",
  // baseQuery: baseQueryWithRefreshToken,
  //---------when axios user then reducerPath= api--------------
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: getBaseUrl }),
  //-----------------------------------------------------------
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});
