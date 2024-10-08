
import Cookies from "js-cookie";
import api from "@/api";

export const fetchWithToken = (url, options = {}) => {
  const token = Cookies.get("accessToken");
  if (!token) throw new Error("Unauthorized");

  return api.get(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token,
      "Content-Type": "application/json",
    },
  });
};
// my 
export const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

import { fetchWithToken } from "@/utils/api";
import { formatTime } from "@/utils/time";

useEffect(() => {
  const fetchProjects = async () => {
    try {
      const response = await fetchWithToken(
        `/api/v1/project/projects?sort-by=${sortBy}&sort-order=${sortOrder}`
      );
      dispatch(setAllProjects(response.data));
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  fetchProjects();
}, [tab, sortBy, sortOrder, dispatch]);
