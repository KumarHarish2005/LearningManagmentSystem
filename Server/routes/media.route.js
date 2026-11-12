import express from 'express'
import upload from "../utils/multer.js"
import { uploadMedia } from '../utils/cloudinary.js'
import isAuthenticated from '../middleware/isAuthenticated.js';


const router = express.Router();

router.route("/upload-video").post(upload.single("file"),async(req,res)=>{
    try {
        const result = await uploadMedia(req.file.path);
        res.status(200).json({
            success:true,
            message:"File uploaded successfully",
            url: result.secure_url,
            data: {
                public_id: result.public_id
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Error while uploading file"
        })
    }
})

export default router;