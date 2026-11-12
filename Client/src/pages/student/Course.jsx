import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, BookOpen, GraduationCap, UserRound } from "lucide-react";
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
    isPublished,
  } = course;

  // Remove HTML tags from the description for a short card preview.
  const plainDescription = description
    ?.replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const instructorName = creator?.name || "Instructor";
  const navigate = useNavigate();
  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-gray-800 dark:bg-[#171717] dark:hover:border-blue-800">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {courseThumbnail ? (
          <img
            src={courseThumbnail}
            alt={courseTitle || "Course thumbnail"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <GraduationCap className="h-16 w-16 text-gray-400" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <Badge className="absolute left-4 top-4 border-0 bg-white/90 text-gray-900 hover:bg-white">
          {category || "General"}
        </Badge>

        <span className="absolute bottom-4 left-4 rounded-md bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {courseLevel || "Beginner"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title and Subtitle */}
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
        <p className="mb-5 line-clamp-2 min-h-10 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {plainDescription || "Explore this course and develop new skills."}
        </p>

        {/* Instructor */}
        <div className="mb-5 flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
            <AvatarImage src={creator?.photoURL} alt={instructorName} />
            <AvatarFallback className="bg-blue-100 font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
              {instructorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Instructor
            </p>
            <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
              {instructorName}
            </p>
          </div>
        </div>

        {/* Course Information */}
        <div className="mb-5 flex items-center gap-4 border-y border-gray-100 py-3 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span>{lectures?.length || 0} Lectures</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UserRound className="h-4 w-4 text-blue-500" />
            <span>{courseLevel || "Beginner"}</span>
          </div>
        </div>

        {/* Price and Action */}
        {purchased !== "purchased" ? (
          <div className="mt-auto flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                Course Price
              </p>

              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {coursePrice === 0 ? "Free" : `₹${coursePrice ?? 0}`}
              </p>
            </div>
          </div>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-3">
          <Button
            onClick={() => navigate(`/course-detail/${_id}`)}
            className="gap-2 rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          > {purchased==="purchased"?"Continue Learning":"Know More"}
            
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Course;
