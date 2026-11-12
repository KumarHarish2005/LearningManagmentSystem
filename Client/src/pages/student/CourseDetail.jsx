import React from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  GraduationCap,
  UserRound,
  CalendarDays,
  PlayCircle,
  CheckCircle2,
  Globe,
  Award,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import BuyCourseButton from "@/components/ui/BuyCourseButton";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseapi";

const CourseDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [showPlayer, setShowPlayer] = useState(false);

  const courseId = params.courseId;
  const { data, isLoading, isSuccess, error, isError } =
    useGetCourseDetailWithStatusQuery(courseId, {
      refetchOnMountOrArgChange: true,
    });

  if (isLoading) {
    return <h1 className="mt-25">Loading...</h1>;
  }
  if (isError) {
    return <h1 className="mt-25">Failed to load data</h1>;
  }
  if (!data) {
    return <h1 className="mt-25">Not found...</h1>;
  }
  const { course, purchased } = data;
  const instructorName = course.creator.name;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 dark:bg-gray-950 mt-2">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-[#171717]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            className="mb-7 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600 dark:text-gray-400"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </button>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Left Content */}
            <div className="space-y-5 lg:col-span-2">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/20 dark:text-blue-300">
                  {course.category}
                </Badge>

                <Badge variant="outline" className="dark:text-white">
                  {course.courseLevel}
                </Badge>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
                {course.courseTitle}
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
                {course.courseSubTitle}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Created by</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {instructorName}
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-x-6 gap-y-4 border-t border-gray-100 pt-5 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  {course.lectures.length} Lectures
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-500" />
                  {course.courseLevel}
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-blue-500" />
                  Updated {course.updatedAt}
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 pt-3">
                <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-700">
                  <AvatarImage src={course.creator.photoURL} />
                  <AvatarFallback className="bg-blue-100 font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                    {instructorName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Course Instructor
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {instructorName}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Purchase Card */}
            <div className="lg:col-span-1">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-black">
                  {showPlayer && course.lectures?.[0]?.videoUrl ? (
                    <ReactPlayer
                      src={course.lectures[0].videoUrl}
                      controls
                      width="100%"
                      height="100%"
                      onEnded={() => setShowPlayer(false)}
                    />
                  ) : (
                    <div className="relative h-full w-full">
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="h-full w-full object-cover"
                      />

                      <button
                        onClick={() => setShowPlayer(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/20"
                      >
                        <PlayCircle className="h-16 w-16 text-white" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-5 p-5">
                  <div>
                    {purchased ? (
                      ""
                    ) : (
                      <>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Course Price
                        </p>
                        <h2 className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
                          ₹{course.coursePrice}
                        </h2>
                      </>
                    )}
                  </div>

                  {purchased ? (
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={() => {
                          if (purchased) {
                            navigate(`/course-progress/${courseId}`);
                          }
                        }}
                        disabled={!purchased}
                        className="w-full rounded-xl bg-blue-600 py-6 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-12"
                      >
                        <BookOpen className="mr-2 h-5 w-5" />
                        Course Progress
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* About and Curriculum */}
          <div className="space-y-10 lg:col-span-2">
            {/* Description */}
            <div>
              <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
                About This Course
              </h2>

              <div
                className="prose prose-blue max-w-none dark:prose-invert dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: course.description,
                }}
              />
            </div>

            {/* Curriculum */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Course Curriculum
                </h2>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {course.lectures.length} Lectures
                </span>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#171717]">
                {course.lectures.map((lecture, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 border-b border-gray-100 p-4 last:border-0 dark:border-gray-800"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <PlayCircle className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                          {index + 1}. {lecture.lectureTitle}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Lecture {index + 1}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      {lecture.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-[#171717]">
              <h3 className="mb-5 text-lg font-bold text-gray-900 dark:text-white">
                Course Information
              </h3>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Lectures</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {course.lectures.length} Lectures
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Level</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {course.courseLevel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Instructor</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {instructorName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {course.updatedAt}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {purchased ? (
              <></>
            ) : (
              <>
                <div className="rounded-2xl bg-blue-600 p-6 text-white">
                  <GraduationCap className="mb-4 h-9 w-9" />
                  <h3 className="mb-2 text-lg font-bold">
                    Start Learning Today
                  </h3>
                  <p className="mb-5 text-sm text-blue-100">
                    Take the next step in your learning journey with this
                    course.
                  </p>
                  <BuyCourseButton
                    courseId={courseId}
                    className="w-full bg-white text-blue-700 hover:bg-blue-50"
                  />
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
