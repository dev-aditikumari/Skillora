const BASE_URL = import.meta.env.VITE_API_URL;

export const endpoints = {
  SENDOTP_API:  BASE_URL + "/auth/sendotp",
  SIGNUP_API:   BASE_URL + "/auth/signup",
  LOGIN_API:    BASE_URL + "/auth/login",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  RESETPASSTOKEN_API:  BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API:   BASE_URL + "/auth/reset-password",
  LOGOUT_API: BASE_URL + "/auth/logout"
};


export const profileEndpoints = {
  GET_USER_DETAILS_API : BASE_URL + "/profile/get-user-details",
  UPDATE_PROFILE_API:BASE_URL + "/profile/updateprofile",
  UPDATE_DISPLAY_PICTURE_API: BASE_URL +"/profile/update-display-picture",
  DELETE_PROFILE_API:BASE_URL +"/profile/delete-profile"
}