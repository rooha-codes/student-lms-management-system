import axios from "axios";

const API = axios.create({
  baseURL:
    "https://a209feb9-4b07-4b4c-9ea6-2ab9095c7e43-00-s1xpw4sjxv0y.sisko.replit.dev/api",
});
// ✅ Attach token on every request
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ✅ Auto logout on invalid token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
