"use client";
import api from "@/api";
import {
  setAllProjects,
  setProjectDescription,
} from "@/app/features/projectSlice";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

function page() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("sort-by");
  const sortBy = searchParams.get("sort-by") || "name";
  const sortOrder = searchParams.get("sort-order") || "asc";
  const [runningProjectId, setRunningProjectId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const { projects, currentProjectId, projectDescription } = useSelector(
    (state) => state.project
  );

  const handleSort = (field) => {
    const newSortOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    router.push(`/web-tracker?sort-by=${field}&sort-order=${newSortOrder}`);
  };

  useEffect(() => {
    const token = Cookies.get("accessToken");

    const fetchProjects = async () => {
      try {
        const response = await api.get(
          `/api/v1/project/projects?sort-by=${sortBy}&sort-order=${sortOrder}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response) {
          const projectAll = response.data;

          if (
            tab === "name" ||
            tab === "most-tracked" ||
            tab === "recently-tracked"
          ) {
            dispatch(setAllProjects(projectAll));
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.errors || "An error occurred");
      }
    };

    if (
      tab === "name" ||
      tab === "most-tracked" ||
      tab === "recently-tracked"
    ) {
      fetchProjects();
    }
  }, [tab, sortBy, sortOrder, dispatch]);

  const startTimer = (projectId) => {
    setRunningProjectId(projectId);
    setStartTime(new Date());
    const intervalId = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
    setTimerId(intervalId);
  };

  const handleTaskNameSubmit = () => {
    if (projectDescription.trim() !== "") {
      dispatch(setProjectDescription(projectDescription));
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleTime = async (projectId) => {
    try {
      setSelectedProjectId(projectId);
      const endTime = new Date();
      const res = await api.post(`/api/v1/project/${projectId}/time-entries`, {
        user_id: projectId,
        task_name: projectDescription,
        start_time: startTime,
        end_time: endTime,
      });

      clearInterval(timerId);
      setRunningProjectId(null);
      dispatch(setProjectDescription(" "));
      setTimer(0);

      toast.success("Time entry successfully recorded!");
    } catch (error) {
      toast.error(
        error?.response?.data?.errors || "Failed to record time entry"
      );
    }
  };
  return (
    <div className="max-w-[1440px] w-full px-[50px] py-[32px]">
      <h1 className="text-[21px] leading-[24px] font-[700] text-[#404040]">
        Web Tracker
      </h1>
      <div className="px-4 pt-4 bg-white rounded-lg shadow-md">
        {projects.length === 0 ? (
          <div>You don’t have any tracking projects yet.</div>
        ) : (
          <div className="block w-full">
            <ul className="flex justify-between text-[14px] pl-[10px] text-gray-400 mt-[40px] border-[#e6e9ed]">
              {/* Sorting buttons */}
              <div className="flex items-center w-full gap-[30px]">
                <button onClick={() => handleSort("name")}>Name</button>
                <button onClick={() => handleSort("most-tracked")}>
                  Total Tracked
                </button>
                <button onClick={() => handleSort("recently-tracked")}>
                  Last Tracked
                </button>
              </div>
              <div className="flex items-center gap-[150px] pr-[25px]">
                <li>
                  <span>Actions</span>
                </li>
              </div>
            </ul>
            {projects.map((item) => (
              <div
                key={item._id}
                className="max-w-[1354px] w-full p-[10px] border-t border-[#e6e9ed] flex"
              >
                <div className="flex items-center gap-[30px] w-full">
                  <div className="project_icon bg-[#c2c7cd] max-w-[40px] w-full flex justify-center items-center p-2 rounded-[50%]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 28 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_201_84216)">
                        <path
                          d="M3.64843 22.7529H23.5351C25.9609 22.7529 27.1562 21.5811 27.1562 19.1787V7.77637C27.1562 5.37402 25.9609 4.20215 23.5351 4.20215H3.64843C1.23437 4.20215 0.0273438 5.37402 0.0273438 7.77637V19.1787C0.0273438 21.5811 1.23437 22.7529 3.64843 22.7529ZM3.67187 20.8779C2.52343 20.8779 1.91406 20.292 1.91406 19.085V7.87011C1.91406 6.6748 2.52343 6.07715 3.67187 6.07715H23.5117C24.6601 6.07715 25.2695 6.6748 25.2695 7.87011V19.085C25.2695 20.292 24.6601 20.8779 23.5117 20.8779H3.67187ZM7.64453 5.22168H9.46093V3.14746C9.46093 2.25683 9.98828 1.75293 10.9023 1.75293H16.2812C17.1953 1.75293 17.7109 2.25683 17.7109 3.14746V5.19824H19.5273V3.27637C19.5273 1.07324 18.3671 0.0419922 16.2461 0.0419922H10.9257C8.92187 0.0419922 7.64453 1.07324 7.64453 3.27637V5.22168Z"
                          fill="white"
                          fill-opacity="0.85"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_201_84216">
                          <rect
                            width="27.1289"
                            height="22.7227"
                            fill="white"
                            transform="translate(0.0273438 0.0419922)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-[17px] text-[#404040]">{item.name}</h1>
                    <p className="text-[11px] text-[#acb3bb]">
                      {runningProjectId === item._id
                        ? `Working on: ${projectDescription}`
                        : "Total Time Time"}
                    </p>
                  </div>
                  {runningProjectId === item._id && (
                    <div className="flex items-center space-x-1">
                      <input
                        placeholder="Briefly describe what you are doing"
                        type="text"
                        className="px-2 py-1 border rounded-md focus:outline-none"
                        value={projectDescription}
                        onChange={(e) =>
                          dispatch(setProjectDescription(e.target.value))
                        }
                        onBlur={handleTaskNameSubmit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleTaskNameSubmit();
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="max-w-[40px] w-full flex justify-center">
                  {runningProjectId === item._id && (
                    <div className="text-green-500">{formatTime(timer)}</div>
                  )}
                  {runningProjectId === item._id ? (
                    <button onClick={() => handleTime(item._id)}>
                      <svg
                        fill="#f6eeee"
                        height="40px"
                        width="40px"
                        viewBox="-29.7 -29.7 356.40 356.40"
                        transform="rotate(0)"
                        stroke="#f6eeee"
                        stroke-width="0.00297"
                      >
                        <g
                          stroke-width="0"
                          transform="translate(66.82499999999999,66.82499999999999), scale(0.55)"
                        >
                          <rect
                            x="-29.7"
                            y="-29.7"
                            width="356.40"
                            height="356.40"
                            rx="178.2"
                            fill="#ff0000"
                            strokewidth="0"
                          ></rect>
                        </g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path d="M148.5,0C66.486,0,0,66.486,0,148.5S66.486,297,148.5,297S297,230.514,297,148.5S230.514,0,148.5,0z M213.292,190.121 c0,12.912-10.467,23.379-23.378,23.379H106.67c-12.911,0-23.378-10.467-23.378-23.379v-83.242c0-12.912,10.467-23.379,23.378-23.379 h83.244c12.911,0,23.378,10.467,23.378,23.379V190.121z"></path>{" "}
                        </g>
                      </svg>
                    </button>
                  ) : (
                    <button onClick={() => startTimer(item._id)}>
                      <svg
                        fill="#eadcdc"
                        height="40px"
                        width="40px"
                        viewBox="-29.7 -29.7 356.40 356.40"
                        stroke="#eadcdc"
                      >
                        <g
                          id="SVGRepo_bgCarrier"
                          stroke-width="0"
                          transform="translate(14.849999999999994,14.849999999999994), scale(0.9)"
                        >
                          <rect
                            x="-29.7"
                            y="-29.7"
                            width="356.40"
                            height="356.40"
                            rx="178.2"
                            fill="#26ad00"
                            strokewidth="0"
                          ></rect>
                        </g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path d="M148.5,0C66.486,0,0,66.486,0,148.5S66.486,297,148.5,297S297,230.514,297,148.5S230.514,0,148.5,0z M202.79,161.734 l-78.501,45.322c-2.421,1.398-5.326,2.138-8.083,2.138c-8.752,0-16.039-7.12-16.039-15.872v-90.645 c0-8.752,7.287-15.872,16.039-15.872c2.758,0,5.579,0.739,8.001,2.138l78.542,45.322c4.966,2.867,7.951,8.001,7.951,13.734 S207.756,158.867,202.79,161.734z"></path>{" "}
                        </g>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
