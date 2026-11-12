
import React, { useState } from 'react';

const categories = [
    "Web Development",
    "Python",
    "AI",
    "Cloud Computing",
    "Maths",
    "Physics",
    "Chemistry",
    "Biology",
    "Finance",
    "Marketing",
    "Management",
    "Design",
    "Photography",
    "Video Editing"
];

const Filter = ({ handleFilterChange }) => {

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");

    const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter((item) => item !== category)
        : [...selectedCategories, category];

    setSelectedCategories(newCategories);

    handleFilterChange(newCategories, sortByPrice);
};

    const handleSortChange = (e) => {
        const value = e.target.value;

        setSortByPrice(value);
        handleFilterChange(selectedCategories, value);
    };

    return (
        <div className='w-full md:w-64 shrink-0 border border-gray-200 dark:border-gray-700 rounded-xl p-5 h-fit space-y-6'>

            {/* Sort By */}
            <div className='space-y-3'>
                <h2 className='font-semibold text-lg text-gray-900 dark:text-white'>
                    Sort By Price
                </h2>

                <select
                    value={sortByPrice}
                    onChange={handleSortChange}
                    className='w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500'
                >
                    <option value="">Default</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                </select>
            </div>

            <div className='border-t border-gray-200 dark:border-gray-700' />

            {/* Categories */}
            <div className='space-y-4'>
                <h2 className='font-semibold text-lg text-gray-900 dark:text-white'>
                    Categories
                </h2>

                <div className='space-y-3'>
                    {categories.map((category) => (
                        <div key={category} className='flex items-center gap-3'>
                            <input
                                type="checkbox"
                                id={category}
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className='h-4 w-4 accent-blue-600 cursor-pointer rounded'
                            />

                            <label
                                htmlFor={category}
                                className='text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                            >
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Filter;
