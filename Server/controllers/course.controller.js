import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import mongoose from "mongoose";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js"

const deleteLecture = async (lectureId) => {
    const lecture = await Lecture.findById(lectureId);

    if (!lecture) return;

    // Delete video from Cloudinary
    if (lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
    }

    // Delete lecture from MongoDB
    await Lecture.findByIdAndDelete(lectureId);
};

export const createCourse = async (req, res) => {


    try {
        const { courseTitle, category, courseSubTitle, description, courseLevel, courseThumbnail, coursePrice } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                success: false,
                message: "Course title and category is required"
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            courseSubTitle,
            description,
            courseLevel,
            courseThumbnail,
            coursePrice,
            creator: req.id
        })
        return res.status(201).json({
            success: true,
            message: "Create course",
            course
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create course"
        })
    }
}

export const searchCourse = async(req,res)=>{
    try {

        const {query="",categories=[],sortByPrice=""}=req.query;

        //create search query
        const searchCriteria = {
            isPublished:true,
            $or:[
                {courseTitle:{$regex:query,$options:"i"}},
                {courseSubTitle:{$regex:query,$options:"i"}},
                {category:{$regex:query,$options:"i"}}
            ]
        }

        //if categories selected
        if(categories.length>0) {
            searchCriteria.category={$in: categories};
        }

        //define sorting order
        const sortOptions = {};
        if(sortByPrice==="low"){
            sortOptions.coursePrice=1;//sort by price in ascending order
        }
        else if(sortByPrice==="high"){
            sortOptions.coursePrice=-1;//descending orderwise sorted
        }

        let courses = await Course.find(searchCriteria).populate({path:"creator",select:"name photoUrl"}).sort(sortOptions)

        return res.status(200).json({
            success:true,
            courses:courses||[]
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to search for any course"
        })
    }
}

export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetching Completed",
            courses
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses"
        })
    }
}

export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        if (course.courseThumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            }

        }
        //thumbnail deleted from cloudinary
        //now delete lectures

        for(const lectureId of course.lectures){
            await deleteLecture(lectureId);
        }
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success:true,
            message:"Course along  with it's lectures removed"
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to remove course"
        })
    }
}

export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, courseSubTitle, description, category, courseLevel, coursePrice } = req.body;
        const courseThumbnail = req.file;

        let course = await Course.findById(courseId)

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        let thumbnail;
        if (courseThumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);
            }
            //upload thumbnail on cloudinary
            thumbnail = await uploadMedia(courseThumbnail.path)

        }
        const updateData = { courseTitle, courseSubTitle, description, category, courseLevel, coursePrice, courseThumbnail: thumbnail?.secure_url || course.courseThumbnail }

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        return res.status(200).json({
            course,
            message: "Course updated successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to edit course",
            error
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",

            })
        }

        return res.status(200).json({
            course
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Fetching this course, couldn't be done",
            error
        })
    }
}

export const createLecture = async (req, res) => {

    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                message: "Lecture title is required"
            })
        };

        //create lecture
        const lecture = await Lecture.create({ lectureTitle });

        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();

        }
        return res.status(201).json({
            lecture,
            message: "Lecture created successfully",
            success: true

        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create lecture",
            error
        })
    }
}

export const getLecture = async (req, res) => {
    console.log("Request params:", req.params);
    console.log("Course ID:", req.params.courseId);
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Failed to fetch the course and its lectures"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to get lectures",
            error
        })
    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            })
        }
        //update lecture
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;

        if (isPreviewFree !== undefined) {
            lecture.isPreviewFree = isPreviewFree;
        }

        await lecture.save();
        //insure course still has lecture id if it was not already added;



        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }
        return res.status(200).json({
            message: "Lecture updated successfully",
            lecture,
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to edit this lecture",
            error
        })
    }
}

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            })
        }
        //delete the lecture from cloudinary
        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // delete lecture from course

        await Course.updateOne(
            { lectures: lectureId }, //find course with lectureid
            { $pull: { lectures: lectureId } }//Remove lecture id
        )
        return res.status(200).json({
            message: "Lecture removed successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete this lecture",
            error
        })
    }
}

export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            })
        }
        return res.status(200).json({
            lecture,
            message: "Lecture retrieved successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete this lecture",
            error
        })
    }
}
//publish unpublish course
export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }

        course.isPublished = publish === "true";
        await course.save();
        const status = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message: `Course is ${status}`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to update availability status",
            error
        })
    }
}

export const getPublishedCourse = async (_, res) => {
    
    try {
        const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoURL" })
        console.log(courses)
        if (!courses) {
            return res.status(404).json({
                message: "No current published course found"
            })
        }
        return res.status(200).json({
            courses
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error
        })
    }
}