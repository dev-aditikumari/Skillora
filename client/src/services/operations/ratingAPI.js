import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { ratingEndpoints } from "../api";

const { CREATE_RATING_API, AVERAGE_RATING_API, ALL_RATINGS_API } = ratingEndpoints;

export const createRating = async (data) => {
  let success = false;
  const toastId = toast.loading("Submitting review...");
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data);
    if (!response.data.success) throw new Error(response.data.message);
    toast.success("Thanks for your review!");
    success = true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Could not submit review");
  }
  toast.dismiss(toastId);
  return success;
};

export const fetchAverageRating = async (courseId) => {
  let result = { averageRating: 0, count: 0 };
  try {
    const response = await apiConnector("POST", AVERAGE_RATING_API, { courseId });
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data;
  } catch (error) {
    console.error("Could not fetch average rating", error);
  }
  return result;
};

export const fetchAllRatings = async (courseId) => {
  let result = [];
  try {
    const response = await apiConnector("POST", ALL_RATINGS_API, { courseId });
    if (!response.data.success) throw new Error(response.data.message);
    result = response.data.data
  } catch (error) {
    console.error("Could not fetch course ratings", error);
  }
  return result;
};