import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API="http://localhost:8080/api/v1/pay"

export const purchaseApi = createApi({
    reducerPath:"purchaseApi",
    baseQuery:fetchBaseQuery({
        baseUrl:COURSE_PURCHASE_API,
        credentials:"include",

    }),
    endpoints:(builder)=> ({
        createCheckoutSession:builder.mutation({
            query:(courseId)=>({
                url:"/course-payment",
                method:"POST",
                body:{courseId}
            })
        }),
        getCourseDetailWithStatus:builder.query({
            query:(courseId)=>({
                url:`/course/${courseId}/detail-with-status`,
                method:"GET"
            })
        }),
        getPurchasedCourses:builder.query({
            query:(courseId)=>({
                url:`/`,
                method:"GET"
            })
        })
    }),
    
})
export const {useCreateCheckoutSessionMutation,useGetCourseDetailWithStatusQuery,useGetPurchasedCoursesQuery} = purchaseApi;
