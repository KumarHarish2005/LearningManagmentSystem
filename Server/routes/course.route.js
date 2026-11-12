import express from 'express'

import isAuthenticated from '../middleware/isAuthenticated.js';
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCreatorCourses, getLecture, getLectureById, getPublishedCourse, removeCourse, removeLecture, togglePublishCourse } from '../controllers/course.controller.js';
import upload from "../utils/multer.js"
const router = express.Router();

router.route('/').post(isAuthenticated,createCourse)
router.route('/published-courses').get(getPublishedCourse);
router.route("/").get(isAuthenticated,getCreatorCourses);
router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"),editCourse);
router.route("/:courseId").delete(isAuthenticated,removeCourse);
router.route("/:courseId").get(isAuthenticated,getCourseById);
router.route("/:courseId/lectures").post(isAuthenticated,createLecture);
router.route("/:courseId/lectures").get(isAuthenticated,getLecture);
router.route("/:courseId/lectures/:lectureId").post(isAuthenticated,editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated,removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated,getLectureById);
router.route("/:courseId").patch(isAuthenticated,togglePublishCourse);

export default router;