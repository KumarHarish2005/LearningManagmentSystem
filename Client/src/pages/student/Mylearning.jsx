import React from "react";
import {
  BookOpen,
  GraduationCap,
  Clock,
  Trophy,
  Play,
  BookPlus,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Course from "./Course";
import { useGetPublishedCoursesQuery } from "@/features/api/courseapi";
import { useSelector } from "react-redux";
import { purchaseApi } from "@/features/api/purchaseapi";

// Sample enrolled courses

const Mylearning = () => {
  const { user } = useSelector((store) => store.auth);

  const { data, isLoading, isSuccess, isError } = useGetPublishedCoursesQuery();

  let courses = data?.courses || [];

  courses = courses.filter((course) =>
    course.enrolledStudents?.some(
      (studentId) => studentId.toString() === user?._id,
    ),
  );

  if (isLoading) {
    return (
      <>
        <p className="teext-bold dark:text-white mt-20">Loading...</p>
      </>
    );
  }
  if (isError) {
    return (
      <>
        <p className="teext-bold dark:text-white mt-20">Some error occured</p>
      </>
    );
  }

  const totalCourses = courses.length;

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-10 pt-24 text-gray-900 dark:bg-[#0A0A0A] dark:text-gray-100 sm:px-6 md:px-8 ">
      {isLoading ? (
        <MyLearningSkeleton />
      ) : (
        <div className="mx-auto max-w-7xl space-y-7 sm:space-y-8">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              My Learning
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Track your progress and continue your learning journey.
            </p>
          </div>

          {/* Course Section */}
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">My Courses</h2>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Continue where you left off.
                </p>
              </div>

              {totalCourses > 0 && (
                <span className="shrink-0 rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {totalCourses} Courses
                </span>
              )}
            </div>

            {/* Empty State */}
            {totalCourses === 0 ? (
              <Card className="border-0 bg-white shadow-sm dark:bg-[#171717]">
                <CardContent className="flex flex-col items-center px-5 py-12 text-center sm:py-16">
                  <div className="mb-5 rounded-full bg-blue-500/10 p-5">
                    <BookOpen className="h-10 w-10 text-blue-500" />
                  </div>

                  <h3 className="text-lg font-semibold sm:text-xl">
                    No courses yet!
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    You haven't enrolled in any courses. Explore our courses and
                    start learning something new.
                  </p>

                  <Button
                    className="mt-6 gap-2"
                    onClick={() => (window.location.href = "/courses")}
                  >
                    <BookPlus className="h-4 w-4" />
                    Explore Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <Course key={course.id} course={course} purchased={"purchased"}/>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Skeleton
const MyLearningSkeleton = () => {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8">
      {/* Heading */}
      <div className="space-y-3">
        <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-72 max-w-full rounded bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl bg-white p-4 dark:bg-[#171717] sm:flex-row sm:items-center"
          >
            <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="space-y-5 rounded-xl bg-white p-5 dark:bg-[#171717]">
        <div className="h-5 w-52 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-64 max-w-full rounded bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Course Heading */}
      <div className="space-y-2">
        <div className="h-7 w-36 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-48 rounded bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl bg-white dark:bg-[#171717]"
          >
            <div className="h-48 bg-gray-200 dark:bg-gray-800" />

            <div className="space-y-4 p-5">
              <div className="h-5 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mylearning;
