import axios from "axios";

// The API runs on a free host that sleeps when idle and takes ~30s to wake.
// Poke it as soon as the app opens so it is awake by the time someone logs in.
try {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) fetch(new URL(apiUrl).origin + "/", { mode: "no-cors" }).catch(() => {});
} catch {
  // a malformed VITE_API_URL only loses the warm-up
}

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
    if (!error.response && error.code !== "ERR_CANCELED") {
      error.message = "The server is waking up (free hosting). Please try again in about 30 seconds.";
    }
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
