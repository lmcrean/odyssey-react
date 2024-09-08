import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleMount = async () => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("handleMount - accessToken:", accessToken ? "exists" : "not found");
    if (!accessToken) {
      console.log("No access token found, assuming user is not logged in");
      return;
    }

    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      console.log("User data fetched successfully:", data);
      setCurrentUser(data);
    } catch (err) {
      console.log("Error fetching user data:", err.response?.status, err.response?.data);
      // If the error is due to an invalid token, we should remove it
      if (err.response?.status === 401) {
        console.log("Removing invalid token");
        localStorage.removeItem("accessToken");
        removeTokenTimestamp();
      }
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useEffect(() => {
    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        console.log("Request interceptor - checking if token should refresh");
        if (shouldRefreshToken()) {
          console.log("Token should refresh, attempting refresh");
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
            console.log("Token refreshed successfully");
          } catch (err) {
            console.log("Token refresh failed:", err.response?.status, err.response?.data);
            setCurrentUser(null);
            removeTokenTimestamp();
            localStorage.removeItem("accessToken");
          }
        }
        return config;
      },
      (err) => {
        console.log("Request interceptor error:", err);
        return Promise.reject(err);
      }
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        console.log("Response interceptor - error status:", err.response?.status);
        if (err.response?.status === 401) {
          console.log("401 error, attempting token refresh");
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
            console.log("Token refreshed successfully in response interceptor");
            return axios(err.config);
          } catch (refreshErr) {
            console.log("Token refresh failed in response interceptor:", refreshErr.response?.status, refreshErr.response?.data);
            setCurrentUser(null);
            removeTokenTimestamp();
            localStorage.removeItem("accessToken");
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};