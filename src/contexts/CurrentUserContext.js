// src/contexts/CurrentUserContext.js

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  const handleMount = async () => {
    const accessToken = localStorage.getItem('access_token');
    
    // If there's no access token, don't attempt to fetch user data
    if (!accessToken) {
      console.log("No access token found. User is not signed in.");
      return;
    }

    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      setCurrentUser(data);
      console.log("PASS. Current user data:", data);
    } catch (err) {
      console.error("Failed to fetch current user data:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        const refreshToken = localStorage.getItem('refresh_token');
        
        // Check if refresh token exists before attempting to refresh
        if (shouldRefreshToken() && refreshToken) {
          try {
            const response = await axios.post("/dj-rest-auth/token/refresh/", {
              refresh: refreshToken,
            });
            config.headers["Authorization"] = `Bearer ${response.data.access}`;
            localStorage.setItem('access_token', response.data.access);
            console.log("PASS. Token refreshed:", response.data);
          } catch (err) {
            console.error("Token refresh failed:", err.response?.data || err.message);
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/signin");
              }
              return null;
            });
            removeTokenTimestamp();
          }
        } else {
          const accessToken = localStorage.getItem('access_token');
          if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
          }
        }

        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          const refreshToken = localStorage.getItem('refresh_token');

          // Ensure refresh token exists before trying to refresh it
          if (refreshToken) {
            try {
              const response = await axios.post("/dj-rest-auth/token/refresh/", {
                refresh: refreshToken,
              });
              axios.defaults.headers["Authorization"] = `Bearer ${response.data.access}`;
              localStorage.setItem('access_token', response.data.access);
              console.log("Token refreshed after 401:", response.data);
              return axios(err.config);
            } catch (err) {
              console.error("Token refresh failed after 401:", err.response?.data || err.message);
              setCurrentUser((prevCurrentUser) => {
                if (prevCurrentUser) {
                  history.push("/signin");
                }
                return null;
              });
              removeTokenTimestamp();
            }
            return axios(err.config);
          }
          return Promise.reject(err);
        }
      }
    );
  }, [history]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
