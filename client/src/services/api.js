const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1").replace(/\/$/, "");

export const endpoints = {
  SENDOTP_API:  BASE_URL + "/auth/sendotp",
  SIGNUP_API:   BASE_URL + "/auth/signup",
  LOGIN_API:    BASE_URL + "/auth/login",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  RESETPASSTOKEN_API:  BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API:   BASE_URL + "/auth/reset-password",
  LOGOUT_API: BASE_URL + "/auth/logout",
  
};


export const profileEndpoints = {
  GET_USER_DETAILS_API : BASE_URL + "/profile/get-user-details",
  UPDATE_PROFILE_API:BASE_URL + "/profile/updateprofile",
  UPDATE_DISPLAY_PICTURE_API: BASE_URL +"/profile/update-display-picture",
  DELETE_PROFILE_API:BASE_URL +"/profile/delete-profile",
  GET_ENROLLED_COURSES_API: BASE_URL + "/profile/enrolled-courses",
}

export const categoriesEndpoints = {
  CATEGORIES_API: BASE_URL + "/course/show-all-categories",
  CATEGORY_PAGE_DETAILS_API: BASE_URL + "/course/category-page-details",
};

export const courseEndpoints = {
  CREATE_COURSE_API: BASE_URL + "/course/create-course",
  EDIT_COURSE_API: BASE_URL + "/course/edit-course",
  GET_INSTRUCTOR_COURSES_API: BASE_URL + "/course/instructor-courses",
  DELETE_COURSE_API: BASE_URL + "/course/delete-course",
  ADD_SECTION_API: BASE_URL + "/course/add-section",
  UPDATE_SECTION_API: BASE_URL + "/course/update-section",
  DELETE_SECTION_API: BASE_URL + "/course/delete-section",
  ADD_SUBSECTION_API: BASE_URL + "/course/add-subsection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/update-subsection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/delete-subsection",
  COURSE_DETAILS_API: BASE_URL + "/course/course-details",
  FULL_COURSE_DETAILS_API: BASE_URL + "/course/full-course-details",
  UPDATE_PROGRESS_API: BASE_URL + "/course/update-progress",    
  GET_INSTRUCTOR_STATS_API: BASE_URL + "/course/instructor-stats",
  PUBLISHED_COURSES_API: BASE_URL + "/course/published-courses",
  PUBLIC_STATS_API: BASE_URL + "/course/public-stats",
};

export const paymentEndpoints = {
  CAPTURE_PAYMENT_API: BASE_URL + "/payment/capture-payment",
  VERIFY_PAYMENT_API: BASE_URL + "/payment/verify-payment",
  ENROLL_FREE_API: BASE_URL + "/payment/enroll-free",
};


export const ratingEndpoints = {
  CREATE_RATING_API: BASE_URL + "/rating/create-rating",
  AVERAGE_RATING_API: BASE_URL + "/rating/average-rating",
  ALL_RATINGS_API: BASE_URL + "/rating/all-ratings",
};

export const adminEndpoints = {
  STATS_API: BASE_URL + "/admin/stats",
  USERS_API: BASE_URL + "/admin/users",
  USER_STATUS_API: BASE_URL + "/admin/user-status",
  COURSES_API: BASE_URL + "/admin/courses",
  CREATE_CATEGORY_API: BASE_URL + "/course/create-category",
};
