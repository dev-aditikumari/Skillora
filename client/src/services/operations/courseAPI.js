import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../api";

const {
  GET_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
   CREATE_COURSE_API,
   EDIT_COURSE_API,
   ADD_SECTION_API,
  UPDATE_SECTION_API,
  DELETE_SECTION_API,
    ADD_SUBSECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SUBSECTION_API,
  COURSE_DETAILS_API,
  FULL_COURSE_DETAILS_API,
  UPDATE_PROGRESS_API,
  GET_INSTRUCTOR_STATS_API,
  PUBLISHED_COURSES_API
} = courseEndpoints;

export const fetchInstructorCourses = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_COURSES_API);
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not fetch courses");
  }
  return result;
};

export const deleteCourse = async (courseId) => {
  let success = false;
  const toastId = toast.loading("Deleting...");
  try {
    const response = await apiConnector("POST", DELETE_COURSE_API, { courseId });
    if (!response.data.success) throw new Error(response.data.message);
    toast.success("Course deleted");
    success = true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not delete course");
  }
  toast.dismiss(toastId);
  return success;
};



export const createCourse = async (formData) => {
  let result = null;
  const toastId = toast.loading("Creating course...");
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, formData);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success("Course created");
    result = response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not create course");
  }
  toast.dismiss(toastId);
  return result;
};
// Calls a course endpoint, returns the updated course (or null on failure)
const callCourseApi = async (method, url, body, loadingMsg, successMsg, errorMsg) => {
  let result = null;
  const toastId = toast.loading(loadingMsg);
  try {
    const response = await apiConnector(method, url, body);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success(successMsg);
    result = response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || errorMsg);
  }
  toast.dismiss(toastId);
  return result;
};

export const addSection = (data) =>
  callCourseApi("POST", ADD_SECTION_API, data, "Creating section...", "Section created", "Could not create section");

export const updateSection = (data) =>
  callCourseApi("PUT", UPDATE_SECTION_API, data, "Updating section...", "Section updated", "Could not update section");

export const deleteSection = (data) =>
  callCourseApi("POST", DELETE_SECTION_API, data, "Deleting section...", "Section deleted", "Could not delete section");

export const addSubSection = (formData) =>
  callCourseApi("POST", ADD_SUBSECTION_API, formData, "Uploading lecture...", "Lecture added", "Could not add lecture");

export const updateSubSection = (formData) =>
  callCourseApi("PUT", UPDATE_SUBSECTION_API, formData, "Updating lecture...", "Lecture updated", "Could not update lecture");

export const deleteSubSection = (data) =>
  callCourseApi("POST", DELETE_SUBSECTION_API, data, "Deleting lecture...", "Lecture deleted", "Could not delete lecture");

export const editCourse = (data) =>
  callCourseApi("PUT", EDIT_COURSE_API, data, "Saving course...", "Course saved", "Could not save course");

export const fetchCourseDetails = async (courseId) => {
  let result = null;
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, { courseId });
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not load course");
  }
  return result;
};

export const fetchFullCourse = async (courseId) => {
  let result = null;
  try {
    const response = await apiConnector("POST", FULL_COURSE_DETAILS_API, { courseId });
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not load course");
  }
  return result;
};

export const markLectureComplete = async (courseId, subSectionId) => {
  let result = null;
  try {
    const response = await apiConnector("POST", UPDATE_PROGRESS_API, { courseId, subSectionId });
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data.completedVideos;
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not update progress");
  }
  return result;
};
export const fetchInstructorStats = async () => {
  let result = null;
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_STATS_API);
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not load dashboard");
  }
  return result;
};


export const fetchPublishedCourses = async (limit = 24) => {
  let result = [];
  try {
    const response = await apiConnector("GET", PUBLISHED_COURSES_API, null, null, { limit });
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data;
  } catch (error) {
    console.error("Could not load courses", error);
  }
  return result;
};
