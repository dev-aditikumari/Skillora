import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { adminEndpoints, categoriesEndpoints } from "../api";

const { STATS_API, USERS_API, USER_STATUS_API, COURSES_API, CREATE_CATEGORY_API } = adminEndpoints;

const message = (error, fallback) => error.response?.data?.message || fallback;

export const fetchAdminStats = async () => {
  try {
    const res = await apiConnector("GET", STATS_API);
    return res.data.stats;
  } catch (error) {
    toast.error(message(error, "Could not load stats"));
    return null;
  }
};

export const fetchUsers = async (accountType = "") => {
  try {
    const res = await apiConnector("GET", USERS_API, null, null, { accountType, limit: 100 });
    return res.data.users;
  } catch (error) {
    toast.error(message(error, "Could not load users"));
    return [];
  }
};

export const setUserActive = async (userId, active) => {
  try {
    const res = await apiConnector("PUT", USER_STATUS_API, { userId, active });
    toast.success(res.data.message);
    return true;
  } catch (error) {
    toast.error(message(error, "Could not update user"));
    return false;
  }
};

export const fetchAdminCourses = async () => {
  try {
    const res = await apiConnector("GET", COURSES_API);
    return res.data.courses;
  } catch (error) {
    toast.error(message(error, "Could not load courses"));
    return [];
  }
};

export const createCategory = async (name, description) => {
  try {
    await apiConnector("POST", CREATE_CATEGORY_API, { name, description });
    toast.success("Category created");
    return true;
  } catch (error) {
    toast.error(message(error, "Could not create category"));
    return false;
  }
};

export const fetchCategories = async () => {
  try {
    const res = await apiConnector("GET", categoriesEndpoints.CATEGORIES_API);
    return res.data.categories;
  } catch {
    return [];
  }
};
