import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { RecommendationResponse, SignupResponse, ToggleBookmarkResult } from "../utils/types";
import { User } from "../store/redux/auth-slice";


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:`http://localhost:3000/api/auth`,
    // prepareHeaders: (headers) => {
    //   // const token = (getState() as RootState).auth.token;

    //   // if (token) {
    //   //   headers.set("Authorization", `Bearer ${token}`);
    //   // }

    //   headers.set("Content-Type", "application/json");

    //   return headers;
    // },
    // fetchFn: (...args) => {
    //   console.log('Making request to:', args[0]);
    //   return fetch(...args);
    // },
  }),
  tagTypes: ['Bookmarks'],

  endpoints: (builder) => ({
    signUp: builder.mutation<SignupResponse, { email: string; fullName:string;password:string }>({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    signin:builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: '/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    updateUser:builder.mutation<User, Partial<User> & { email: string; image?:File }>({
      query: ({ image, ...rest }) => {
        const form = new FormData();
        // append all other fields
        Object.entries(rest).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.append(key, String(value));
          }
        });
        // append the file if present
        if (image) {
          form.append("image", image);
        }
        return {
          url: "/update",
          method: "PUT",
          body: form,
          // Let fetchBaseQuery auto‐set the correct headers for multipart
        };
      },
    }),
    getRecommendations: builder.mutation<RecommendationResponse, { userId: number,disease?:string[],restrictions:string[] }>({
      query: (body) => ({
        url: "/recommend", 
        method: "POST",
        body,
      }),
    }),
    bookmarkRecipe:builder.mutation<ToggleBookmarkResult, { userId: number; recipeUri: number }>({
      query:(body)=>({
        url:"/bookmark",
        method:"POST",
        body
      })
    }),
 

  }),
});

export const { useSignUpMutation ,useSigninMutation,useUpdateUserMutation,useGetRecommendationsMutation,useBookmarkRecipeMutation} = apiSlice;
