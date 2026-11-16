
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  UserRound,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Course = ({ course, purchased, onKnowMore }) => {
  if (!course) return null;

  const {
    _id,
    courseTitle,
    courseSubTitle,
    category,
    courseLevel,
    courseThumbnail,
    coursePrice,
    description,
    creator,
    lectures,
  } = course;

  const navigate = useNavigate();

  const plainDescription = description
    ?.replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const instructorName = creator?.name || "Instructor";
  const isPurchased = purchased === "purchased";

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-gray-800 dark:bg-[#151922] dark:hover:border-blue-500/50">

      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">

        {courseThumbnail ? (
          <img
            src={courseThumbnail}
            alt={courseTitle || "Course thumbnail"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GraduationCap className="h-16 w-16 text-gray-400" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Category */}
        <Badge className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm hover:bg-white">
          {category || "General"}
        </Badge>

        {/* Course Level */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          <span className="text-sm font-semibold">
            {courseLevel || "Beginner"}
          </span>
        </div>

        {/* Price */}
        {!isPurchased && (
          <div className="absolute bottom-3 right-4 rounded-lg bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm dark:bg-gray-900/90">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {Number(coursePrice) === 0
                ? "Free"
                : `₹${coursePrice ?? 0}`}
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">

        {/* Title */}
        <div className="mb-3">
          <h2 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {courseTitle || "Untitled Course"}
          </h2>

          {courseSubTitle && (
            <p className="mt-1 line-clamp-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              {courseSubTitle}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="mb-5 line-clamp-2 min-h-10 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {plainDescription || "Explore this course and develop new skills."}
        </p>

        {/* Instructor */}
        <div className="mb-4 flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
            <AvatarImage
              src={creator?.photoURL}
              alt={instructorName}
            />
            <AvatarFallback className="bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
              {instructorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Course Instructor
            </p>
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
              {instructorName}
            </p>
          </div>
        </div>

        {/* Course Details */}
        <div className="mb-5 flex items-center justify-between border-y border-gray-100 py-3 dark:border-gray-800">

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span>{lectures?.length || 0} Lectures</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UserRound className="h-4 w-4 text-blue-500" />
            <span>{courseLevel || "Beginner"}</span>
          </div>
        </div>

        {/* Action */}
        <div className="mt-auto">
          <Button
            onClick={() => navigate(`/course-detail/${_id}`)}
            className="h-11 w-full justify-between rounded-xl bg-gray-900 px-4 text-white transition-all hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            <span>
              {isPurchased ? "Continue Learning" : "Explore Course"}
            </span>

            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Button>
        </div>

      </div>
    </Card>
  );
};

export default Course;
