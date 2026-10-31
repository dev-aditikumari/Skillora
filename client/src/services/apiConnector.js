import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
  timeout: 60000, // lecture uploads are the slow path, everything else is quick
});

const readToken = () => {
  try {
    const raw = localStorage.getItem("token");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Send the JWT as a Bearer header. Cross-site cookies (Vercel -> Render) are
// blocked by many browsers, so relying on the cookie alone made every
// protected request fail.
axiosInstance.interceptors.request.use((config) => {
  const token = readToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired or revoked session: clear it and send the user to log in once.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    // a 401 from these means "wrong password or code", not "your session expired"
    const isAuthAttempt = /\/auth\/(login|signup|sendotp|reset-password|changepassword)/.test(url);
    if (status === 401 && !isAuthAttempt && readToken()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login?expired=1");
      }
    }
    return Promise.reject(error);
  }
);

export function apiConnector(method, url, bodyData, headers, params) {
  return axiosInstance({
    method,
    url,
    data: bodyData || null,
    headers: headers || null,
    params: params || null,
  });
}
