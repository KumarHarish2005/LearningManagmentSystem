
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseapi";
import axios from "axios";
import {
  Loader2,
  Save,
  Trash2,
  Video,
  Upload,
  CheckCircle2,
  Film,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);

  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isNewVideoUploaded,setIsnewVideoUploaded]=useState(false);
  const [
    editLecture,
    { data, isLoading, error, isSuccess },
  ] = useEditLectureMutation();

  const [
    removeLecture,
    {
      data: removeData,
      isLoading: removeLoading,
      isSuccess: removeSuccess,
      error: removeError,
    },
  ] = useRemoveLectureMutation();

  const {
   
      data:lectureData,isLoading:lectureLoading,
      isSuccess:lectureSuccess,
      error:lectureError
    
   } = useGetLectureByIdQuery(lectureId,{refetchOnMountOrArgChange:true});
  const lecture = lectureData?.lecture;
  useEffect(()=>{
    if(lecture){
      setTitle(lecture.lectureTitle??"");
      setUploadVideoInfo({
        videoUrl:lectureData?.lecture?.videoUrl??"",
        publicId:lectureData?.lecture?.publicId??""
      })
      setIsFree(lectureData?.lecture?.isPreviewFree??false);
    }
  },[lecture])
  // Video upload handler
  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setMediaProgress(true);
    setUploadProgress(0);
    

    try {
      const res = await axios.post(
        `${MEDIA_API}/upload-video`,
        formData,
        {
          onUploadProgress: ({ loaded, total }) => {
            if (total) {
              setUploadProgress(
                Math.round((loaded * 100) / total)
              );
            }
          },
        }
      );

      if (res.data.success) {
        setUploadVideoInfo({
          videoUrl: res.data.url,
          publicId: res.data.data.public_id,
        });

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Video upload failed"
      );
    } finally {
      setMediaProgress(false);
      setIsnewVideoUploaded(true);
    }
  };

  // Edit lecture handler
  const editLectureHandler = async () => {
    if (mediaProgress) {
      toast.error("Please wait for video upload to finish");
      return;
    }
    if(!title.trim()){
      toast.error("Title of lecture is a required field")
      return;
    }

    try {
      await editLecture({
        lectureTitle: title,
        videoInfo: uploadVideoInfo,
        isPreviewFree: isFree,
        courseId,
        lectureId,
      }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  // Remove lecture handler
  const removeLectureHandler = async () => {
    try {
      await removeLecture(lectureId).unwrap();
      navigate(`/admin/courses/${courseId}/lectures`)
    } catch (error) {
      console.log(error);
    }
  };

  // Success and error notifications
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture updated successfully");
    }

    if (error) {
      toast.error(error?.data?.message || "Failed to update lecture");
    }

    if (removeSuccess) {
      toast.success(removeData?.message || "Lecture removed");
    }

    if (removeError) {
      toast.error(removeError?.data?.message || "Failed to remove lecture");
    }
  }, [
    isSuccess,
    error,
    data,
    removeSuccess,
    removeData,
    removeError,
  ]);

  if (lectureLoading) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading lecture details...
        </p>
      </div>
    </div>
  );
}

if (lectureError) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
      <p className="text-sm text-red-500">
        Failed to load lecture details.
      </p>
      <Button variant="outline" onClick={() => navigate(-1)}>
        Go Back
      </Button>
    </div>
  );
}

  return (
    <Card className="w-full overflow-hidden border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

      {/* Header */}
      <CardHeader className="flex flex-col gap-4 border-b border-gray-100 px-4 py-5 dark:border-gray-800 sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between">

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/10">
              <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>

            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
              Edit Lecture
            </CardTitle>
          </div>

          <CardDescription className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Update lecture details, upload videos and manage free preview.
          </CardDescription>
        </div>

        <Button
          variant="destructive"
          onClick={removeLectureHandler}
          disabled={removeLoading || isLoading || mediaProgress}
          className="w-full gap-2 sm:w-fit"
        >
          {removeLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Removing...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Remove Lecture
            </>
          )}
        </Button>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-7 px-4 py-6 sm:px-6 sm:py-7">

        {/* Lecture title */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label
              htmlFor="lecture-title"
              className="text-sm font-semibold text-gray-800 dark:text-gray-200"
            >
              Lecture Title
            </Label>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Give your lecture a clear and descriptive title.
            </p>
          </div>

          <Input
            id="lecture-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Introduction to Express.js"
            disabled={isLoading || removeLoading}
            className="h-11 bg-gray-50 dark:bg-gray-950"
          />
        </div>

        {/* Video upload */}
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Lecture Video
              <span className="ml-1 text-red-500">*</span>
            </Label>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload the video for this lecture.
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 transition-colors dark:border-gray-700 dark:bg-gray-950 sm:p-5">

            <div className="flex flex-col items-center gap-3 text-center">

              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-500/10">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Choose your lecture video
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supported format: MP4, MOV, AVI and other video formats
                </p>
              </div>

              <Input
                type="file"
                accept="video/*"
                onChange={fileChangeHandler}
                disabled={mediaProgress || isLoading || removeLoading}
                className="w-full max-w-sm cursor-pointer bg-white text-xs dark:bg-gray-900"
              />
            </div>

            {/* Upload progress */}
            {mediaProgress && (
              <div className="mt-6 space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />

                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Uploading video...
                    </span>
                  </div>

                  <span className="text-sm font-bold tabular-nums text-blue-600 dark:text-blue-400">
                    {uploadProgress}%
                  </span>
                </div>

                <Progress
                  value={uploadProgress}
                  className="h-2.5 bg-blue-100 dark:bg-gray-800"
                />

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Please keep this page open until the upload finishes.
                </p>
              </div>
            )}

            {/* Upload completed */}
            {!mediaProgress && uploadVideoInfo && isNewVideoUploaded &&(
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />

                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Video uploaded successfully!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Free preview */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 sm:flex-row sm:items-center sm:justify-between sm:p-5">

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/10">
              <Film className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="free-preview"
                className="cursor-pointer text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Free Preview
              </Label>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Allow students to watch this lecture without purchasing the course.
              </p>
            </div>
          </div>

          <Switch
            id="free-preview"
            checked={isFree}
            onCheckedChange={setIsFree}
            disabled={isLoading || removeLoading}
            className="h-6 w-11 shrink-0 rounded-full border-0 bg-gray-300 data-[checked]:bg-blue-600 data-[unchecked]:bg-gray-300 dark:data-[unchecked]:bg-gray-700 [&_span]:h-5 [&_span]:w-5 [&_span]:bg-white [&_span]:shadow-md"
          />
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-4 py-4 dark:border-gray-800 dark:bg-gray-950 sm:flex-row sm:justify-end sm:px-6">

        <Button
          onClick={editLectureHandler}
          disabled={isLoading || removeLoading || mediaProgress}
          className="w-full gap-2 bg-blue-600 px-6 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98] sm:w-auto"
        >
          {(isLoading )? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LectureTab;
