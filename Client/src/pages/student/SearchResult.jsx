import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-200 dark:border-gray-700 py-5 gap-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full"
      >
        <img
          src={course.courseThumbnail}
          alt="course-thumbnail"
          className="h-32 w-full md:w-56 object-cover rounded-lg"
        />

        <div className="flex flex-col gap-2 flex-1">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {course.courseTitle}
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            {course.courseSubTitle}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Price
            </span>
            <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400">
              ₹{course.coursePrice}
            </span>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Instructor{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {course.creator.name}
            </span>
          </p>

          <Badge className="w-fit">{course.courseLevel}</Badge>
        </div>
      </Link>
    </div>
  );
};

export default SearchResult;
