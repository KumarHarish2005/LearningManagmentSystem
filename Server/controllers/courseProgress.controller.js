import { CourseProgress } from "../models/courseProgress.model.js";
import { Course } from "../models/course.model.js"
export const getCourseProgress = async (req, res) => {
    try {

        const { courseId } = req.params;
        const userId = req.id;

        //step-1 fetch the user course progress
        let courseProgress = await CourseProgress.findOne({
            courseId, userId
        }).populate("courseId");

        const courseDetails = await Course.findById(courseId).populate("lectures");

        if (!courseDetails) {
            return res.status(404).json({
                message: "Course not found"
            })
        }

        //step-2 if no progress found return course details with an empty progress

        if (!courseProgress) {
            return res.status(200).json({
                message: "New course, no progress found",
                data: {
                    courseDetails,
                    progress: [],
                    completed: false
                }
            })
        }

        //step-3 return user course progress along with course details

        return res.status(200).json({
            message: "Course has a progress",
            data: {
                courseDetails,
                progress: courseProgress.lectureProgress,
                completed: courseProgress.completed
            }
        })

    } catch (error) {
        console.log(error);
    }
}

export const updateLectureProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        //fetch or create course progress
        let courseProgress = await CourseProgress.findOne({
            courseId, userId
        });

        if (!courseProgress) {
            //no progress exist create a new recors
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress: []
            })
        }

        //find the lecture progress in teh course progress
       const lectureIndex = courseProgress.lectureProgress.findIndex(
    (lecture) => String(lecture.lectureId) === String(lectureId)
);

        if (lectureIndex !== -1) {
            //if lecture already exists, update it's status
            courseProgress.lectureProgress[lectureIndex].viewed = true;

        } else {
            //add new lecture progress
            courseProgress.lectureProgress.push({ lectureId, viewed: true })
        }

        //if all lectures are completed
        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg)=>lectureProg.viewed).length;

        const course=await Course.findById(courseId);
        if(course.lectures.length===lectureProgressLength){
            courseProgress.completed=true;
        }
        await courseProgress.save();

        return res.status(200).json({
            message:"Lecture progress updated successfully."
        })

    } catch (error) {
        console.log(error)
    }
}

export const markAsCompleted = async (req,res)=>{
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId,userId});

        if(!courseProgress){
            return res.status(404);
        }
        courseProgress.lectureProgress.map((lectureProgress)=> lectureProgress.viewed = true);

        courseProgress.completed=true;

        await courseProgress.save()
       return res.status(200).json({
            message:"Course marked as competed",
            success:true
        })

    } catch (error) {
        console.log(error)
    }
}

export const markAsInCompleted = async (req,res)=>{
    try {
        const {courseId} = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({courseId,userId});

        if(!courseProgress){
            return res.status(404);
        }
        courseProgress.lectureProgress.map((lectureProgress)=> lectureProgress.viewed = false);

        courseProgress.completed=false;

        await courseProgress.save()
       return res.status(200).json({
            message:"Course marked as incompeted",
            success:true
        })

    } catch (error) {
        console.log(error)
    }
}