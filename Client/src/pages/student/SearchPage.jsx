import Filter from "./Filter";
import { SearchX } from "lucide-react";
import React, { useState } from "react";
import SearchResult from "./SearchResult";
import { useGetSearchCoursesQuery } from "@/features/api/courseapi";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [searchParams]=useSearchParams();
  const query = searchParams.get("query");
  const [selectedCategories,setSelectedCategories]=useState([]);
  const [sortByPrice,setSortByPrice]=useState("");
  const {data,isLoading}=useGetSearchCoursesQuery({
    searchQuery:query,
    categories:selectedCategories,
    sortByPrice
  });
  
  const isEmpty = !isLoading && data?.courses.length===0;

  const handleFilterChange = (categories,price) =>{
    setSelectedCategories(categories);
    setSortByPrice(price);
  }
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 mt-20 dark:text-gray-300">
      <h1 className="text-2xl font-bold">Results for "{query}"</h1>

      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Showing results for{" "}
        <span className="text-blue-800 font-bold italic">
          {query}
        </span>
      </p>

      <div className="flex flex-col md:flex-row gap-10">
        <Filter handleFilterChange={handleFilterChange}/>

        <div className="flex-1">
          {isLoading ? (
            // Course Skeleton
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-5 p-4 mb-5 border rounded-xl dark:border-gray-700 animate-pulse"
              >
                {/* Course Thumbnail */}
                <div className="w-full sm:w-56 h-40 bg-gray-200 dark:bg-gray-800 rounded-lg" />

                {/* Course Details */}
                <div className="flex-1 space-y-4 py-2">
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />

                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />

                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />

                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : isEmpty ? (
            // No Courses Found
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
                <SearchX className="w-10 h-10 text-gray-500" />
              </div>

              <h2 className="text-xl font-bold mb-2">No courses found</h2>

              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find any courses matching your search. Try different
                keywords or adjust your filters.
              </p>
            </div>
          ) : (
            <>
              {data?.courses?.map((course) => (
                <SearchResult key={course._id} course={course} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
