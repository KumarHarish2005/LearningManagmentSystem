import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const COURSE_API = "http://localhost:8080/api/v1/course"
export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ['Refetch_creator_course', "Refetch_Lecture"],
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (courseData) => ({
                url: "/",
                method: "POST",
                body: courseData,

            }),
            invalidatesTags: ['Refetch_creator_course']
        }),
        getSearchCourses: builder.query({
            query: ({ searchQuery, categories, sortByPrice }) => {
                //Build query string
                let queryString = `/search?query=${encodeURIComponent(searchQuery||"")}`;
                //append category
                if(categories &&categories.length>0){
                    const categoriesString = categories.map(encodeURIComponent).join(",")
                    queryString+= `&categories=${categoriesString}`;
                }
                //append sort by price if aavailable
                if(sortByPrice){
                queryString+= `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
                }
                return {
                    url:queryString,
                    method:"GET",
                }
            }
            
        }),
        deleteCourse: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Refetch_creator_course']
        }),
        getPublishedCourses: builder.query({
            query: () => ({
                url: "/published-courses",
                method: "GET"
            })
        })
        ,
        getCreatorCourse: builder.query({
            query: () => ({
                url: "/",
                method: "GET"
            }),
            providesTags: ['Refetch_creator_course']
        }),
        editCourse: builder.mutation({
            query: ({ courseData, courseId }) => ({
                url: `/${courseId}`,
                method: "PUT",
                body: courseData
            }),
            providesTags: ['Refetch_creator_course']
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET"

            })
        }),
        createLecture: builder.mutation({
            query: ({ lectureTitle, courseId }) => ({
                url: `/${courseId}/lectures`,
                method: "POST",
                body: { lectureTitle }
            })
        }),
        getLectures: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lectures`,
                method: "GET"

            }),
            providesTags: ['Refetch_Lecture']
        }),
        editLecture: builder.mutation({
            query: ({ lectureTitle, videoInfo, isPreviewFree, courseId, lectureId }) => ({
                url: `/${courseId}/lectures/${lectureId}`,
                method: "POST",
                body: { lectureTitle, videoInfo, isPreviewFree }
            })
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Refetch_Lecture']
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET"
            })
        }),
        publishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
                url: `/${courseId}?publish=${query}`,
                method: "PATCH"
            }),
            invalidatesTags: ["Refetch_creator_course"]
        })

    })
})

export const { useCreateCourseMutation, useGetSearchCoursesQuery,useGetPublishedCoursesQuery,
    useGetCreatorCourseQuery, useDeleteCourseMutation, useEditCourseMutation, useGetCourseByIdQuery, useCreateLectureMutation, useGetLecturesQuery, useEditLectureMutation, useRemoveLectureMutation, useGetLectureByIdQuery, usePublishCourseMutation
} = courseApi;

