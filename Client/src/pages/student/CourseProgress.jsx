
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  CirclePlay,
  Play,
  Trophy,
  RotateCcw,
} from "lucide-react";

import {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useMarkAsCompletedMutation,
  useMarkAsInCompletedMutation,
} from "@/features/api/courseProgressapi";

const CourseProgress = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [selectedLectureId, setSelectedLectureId] = useState(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetCourseProgressQuery(courseId);

  const [updateLectureProgress, { isLoading: updatingLecture }] =
    useUpdateLectureProgressMutation();

  const [markAsCompleted, { isLoading: completing }] =
    useMarkAsCompletedMutation();

  const [markAsInCompleted, { isLoading: resetting }] =
    useMarkAsInCompletedMutation();

  const courseDetails = data?.data?.courseDetails;
  const lectures = courseDetails?.lectures || [];
  const progress = data?.data?.progress || [];
  const completed = data?.data?.completed || false;

  // Select the first lecture by default
  useEffect(() => {
    if (lectures.length > 0 && !selectedLectureId) {
      setSelectedLectureId(lectures[0]._id);
    }
  }, [lectures, selectedLectureId]);

  const currentLecture =
    lectures.find(
      (lecture) => String(lecture._id) === String(selectedLectureId)
    ) 

  // Check whether a lecture has been viewed
  const isLectureViewed = (lectureId) => {
    return progress.some(
      (item) =>
        String(item.lectureId) === String(lectureId) && item.viewed
    );
  };

  const completedLectures = lectures.filter((lecture) =>
    isLectureViewed(lecture._id)
  ).length;

  const totalLectures = lectures.length;

  const progressPercentage = totalLectures
    ? Math.round((completedLectures / totalLectures) * 100)
    : 0;

  const handleSelectLecture = (lecture) => {
    setSelectedLectureId(lecture._id);
};
  const handleVideoEnded = async () => {
    if (!currentLecture) return;

    if (isLectureViewed(currentLecture._id)) return;

    try {
        await updateLectureProgress({
            courseId,
            lectureId: currentLecture._id
        }).unwrap();

        await refetch();

    } catch (error) {
        console.error("Progress update failed:", error);
    }
};

  // Mark entire course as completed
  const handleCompleteCourse = async () => {
    try {
      await markAsCompleted(courseId).unwrap();
      await refetch();
    } catch (error) {
      console.error("Failed to complete course:", error);
    }
  };

  // Reset course completion
  const handleResetCourse = async () => {
    try {
      await markAsInCompleted(courseId).unwrap();
      await refetch();
    } catch (error) {
      console.error("Failed to reset course:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
        <p className="text-gray-500 animate-pulse">
          Loading your course...
        </p>
      </div>
    );
  }

  if (isError || !courseDetails) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center dark:bg-gray-950">
        <p className="text-red-500">Unable to load course.</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  // Adapt these fields to your Lecture model if necessary
  const videoUrl =
    currentLecture?.videoUrl ||
    currentLecture?.videoInfo?.videoUrl ||
    currentLecture?.videoInfo?.secure_url ||
    currentLecture?.videoInfo?.url;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-10 mt-20">

      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">

          <div className="flex items-center gap-3 min-w-0">

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft size={18} />
            </Button>

            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {courseDetails.courseTitle}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Continue your learning journey
              </p>
            </div>
          </div>

          <Button
            onClick={completed ? handleResetCourse : handleCompleteCourse}
            disabled={completing || resetting || totalLectures === 0}
            variant={completed ? "outline" : "default"}
            className="w-full sm:w-auto"
          >
            {completed ? (
              <>
                <RotateCcw size={16} className="mr-2" />
                Reset Progress
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Mark as Completed
              </>
            )}
          </Button>

        </div>

        {/* Progress Card */}
        <Card className="mb-6 border-none shadow-sm dark:bg-gray-900">
          <CardContent className="p-4 sm:p-5">

            <div className="flex items-center justify-between mb-3">

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Your Progress
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {completedLectures} of {totalLectures} lectures completed
                </p>
              </div>

              <span className="text-xl font-bold text-blue-600">
                {progressPercentage}%
              </span>

            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">

              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />

            </div>

            {completed && (
              <div className="flex items-center gap-2 mt-4 text-green-600 text-sm font-medium">
                <Trophy size={17} />
                Congratulations! You completed this course.
              </div>
            )}

          </CardContent>
        </Card>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Video Section */}
          <div className="lg:col-span-2 min-w-0">

            <Card className="overflow-hidden border-none shadow-md dark:bg-gray-900">

              {/* Video Player */}
              <div className="bg-black aspect-video flex items-center justify-center">

                {videoUrl ? (
    <video
        key={currentLecture?._id}
        src={videoUrl}
        controls
        className="w-full h-full object-contain"
        onEnded={handleVideoEnded}
        controlsList="nodownload"
    />
) : (
    <div className="text-center text-white px-4">
        <Play size={48} className="mx-auto mb-3 opacity-70" />
        <p className="font-medium">
            {currentLecture
                ? "Video unavailable"
                : "Select a lecture to begin"}
        </p>
        <p className="text-sm text-gray-400 mt-2">
            {currentLecture?.lectureTitle || "No lecture selected"}
        </p>
    </div>
)}

              </div>

              {/* Current Lecture Details */}
              <CardContent className="p-4 sm:p-6">

                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-full">
                    NOW PLAYING
                  </span>

                  <span className="flex items-center gap-2 text-sm text-gray-500">
                    <BookOpen size={16} />
                    {totalLectures} Lectures
                  </span>

                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {currentLecture?.lectureTitle || "Select a lecture"}
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  {currentLecture
                    ? `Lecture ${
                        lectures.findIndex(
                          (l) => l._id === currentLecture._id
                        ) + 1
                      } of ${totalLectures}`
                    : "Choose a lecture from the course content."}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-5">

                  {currentLecture && (
                    <span
                      className={`text-sm flex items-center gap-2 ${
                        isLectureViewed(currentLecture._id)
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {isLectureViewed(currentLecture._id) ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <CirclePlay size={17} />
                      )}

                      {isLectureViewed(currentLecture._id)
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  )}

                  {updatingLecture && (
                    <span className="text-xs text-blue-500">
                      Updating progress...
                    </span>
                  )}

                </div>

              </CardContent>
            </Card>

          </div>

          {/* Lecture Sidebar */}
          <div className="min-w-0">

            <Card className="border-none shadow-md dark:bg-gray-900">

              <CardContent className="p-4">

                <div className="flex items-center justify-between mb-4">

                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Course Content
                    </h2>

                    <p className="text-xs text-gray-500 mt-1">
                      Select a lecture to watch
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-blue-600">
                    {completedLectures}/{totalLectures}
                  </span>

                </div>

                {/* Lecture List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">

                  {lectures.map((lecture, index) => {

                    const viewed = isLectureViewed(lecture._id);

                    const active =
                      String(selectedLectureId) === String(lecture._id);

                    return (
                      <button
                        key={lecture._id}
                            onClick={() => handleSelectLecture(lecture)}

                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                          active
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >

                        <div className="shrink-0">

                          {viewed ? (
                            <CheckCircle2
                              size={22}
                              className="text-green-500"
                            />
                          ) : (
                            <CirclePlay
                              size={22}
                              className={
                                active
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              }
                            />
                          )}

                        </div>

                        <div className="flex-1 min-w-0">

                          <p className="text-xs text-gray-500 mb-1">
                            Lecture {index + 1}
                          </p>

                          <h3
                            className={`text-sm font-medium line-clamp-2 ${
                              active
                                ? "text-blue-600"
                                : "text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {lecture.lectureTitle}
                          </h3>

                        </div>

                        {viewed && (
                          <Check
                            size={17}
                            className="text-green-500 shrink-0"
                          />
                        )}

                      </button>
                    );
                  })}

                  {lectures.length === 0 && (
                    <p className="text-center text-sm text-gray-500 py-8">
                      No lectures available.
                    </p>
                  )}

                </div>

                {/* Sidebar Footer */}
                <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Overall completion
                    </span>

                    <span className="font-semibold text-gray-900 dark:text-white">
                      {progressPercentage}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">

                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />

                  </div>

                </div>

              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
