import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import LectureTab from './LectureTab';

const EditLecture = () => {
    const { courseId } = useParams();

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mt-14 sm:mt-16">

                {/* Header */}
                <div className="flex flex-col gap-5 mb-6 sm:mb-8">

                    <div className="flex items-center gap-3">

                        <Link to={`/admin/courses/${courseId}/lectures`}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-9 w-9 sm:h-10 sm:w-10 shrink-0 border-gray-300 dark:border-gray-700"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>

                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                Update Your Lecture
                            </h1>

                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Manage and update your lecture details
                            </p>
                        </div>

                    </div>

                    {/* Lecture Tab */}
                    <div className="w-full min-w-0">
                        <LectureTab />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default EditLecture;