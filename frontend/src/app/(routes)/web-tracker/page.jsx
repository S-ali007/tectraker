"use client";
import api from "@/api";
import {
  setAllProjects,
  setProjectDescription,
  setTaskDuration,
} from "@/app/features/projectSlice";
import { setRunningProjectId } from "@/app/features/timerSlice";
import WebTracker from "@/assets/icons/WebTracker";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

function Page() {
  const searchParams = useSearchParams();

  const sortBy = searchParams.get("sort-by") || "name";
  const sortOrder = searchParams.get("sort-order") || "asc";
  // const [runningProjectId, setRunningProjectId] = useState(null);
  const actionRef = useRef(null);

  const [timer, setTimer] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const [activeAction, setActiveAction] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const { projects, projectDescription, taskDuration } = useSelector(
    (state) => state.project
  );
  const { runningProjectId } = useSelector((state) => state.time);
  const handleSort = (field) => {
    const newSortOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    router.push(`/web-tracker?sort-by=${field}&sort-order=${newSortOrder}`);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const token = Cookies.get("accessToken");
      if (!token) return router.push("/login");

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
        dispatch(setAllProjects(response.data));
      } catch (error) {
        toast.error(error?.response?.data?.errors || "An error occurred");
      }
    };

    if (projects.length === 0) {
      fetchProjects();
    }
  }, [sortBy, sortOrder, dispatch, router, projects]);

  useEffect(() => {
    const savedProjectId = localStorage.getItem("runningProjectId");
    const savedStartTime = localStorage.getItem("startTime");
    const savedTimer = localStorage.getItem("timer");

    if (savedProjectId && savedStartTime) {
      const timeElapsed =
        (Date.now() - new Date(savedStartTime).getTime()) / 1000;
      dispatch(setRunningProjectId(savedProjectId));
      setStartTime(new Date(savedStartTime));
      setTimer(parseInt(savedTimer) + Math.floor(timeElapsed));
      const intervalId = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
      setTimerId(intervalId);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, []);

  const startTimer = (projectId) => {
    setActiveAction(true);
    const currentStartTime = new Date();
    dispatch(setRunningProjectId(projectId));
    setStartTime(currentStartTime);
    const intervalId = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
    setTimerId(intervalId);

    localStorage.setItem("runningProjectId", projectId);
    localStorage.setItem("startTime", currentStartTime);
    localStorage.setItem("timer", 0);
  };

  useEffect(() => {
    const storedDescription = localStorage.getItem("projectDescription");
    if (storedDescription) {
      dispatch(setProjectDescription(storedDescription));
    }
  }, []);

  const handleTaskNameSubmit = () => {
    const trimmedDescription = projectDescription.trim();

    if (trimmedDescription !== "") {
      dispatch(setProjectDescription(trimmedDescription));
      localStorage.setItem("projectDescription", trimmedDescription);
    } else {
      localStorage.removeItem("projectDescription");
      dispatch(setProjectDescription(""));
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes} min ${seconds < 10 ? "0" : ""}${seconds} sec`;
  };

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const handleTimeCore = async (projectId) => {
    const token = Cookies.get("accessToken");
    const endTime = new Date();
    const res = await api.post(
      `/api/v1/project/${projectId}/time-entries`,
      {
        user_id: projectId,
        task_name: projectDescription,
        start_time: startTime,
        end_time: endTime,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(setTaskDuration(res.data.data.activties));

    const updatedProjects = await api.get(
      `/api/v1/project/projects?sort-by=${sortBy}&sort-order=${sortOrder}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    dispatch(setAllProjects(updatedProjects.data));
  };

  const debouncedHandleTimeCore = debounce(handleTimeCore, 300);

  const handleTime = async (projectId) => {
    try {
      await debouncedHandleTimeCore(projectId);
    } catch (error) {
      toast.error(
        error?.response?.data?.errors || "Failed to record time entry"
      );
    } finally {
      clearInterval(timerId);
      dispatch(setRunningProjectId(null));
      dispatch(setProjectDescription(""));
      setTimer(0);

      localStorage.removeItem("runningProjectId");
      localStorage.removeItem("startTime");
      localStorage.removeItem("timer");

      toast.success("Tracked successfully!");
    }
  };

  const handleClickOutside = (event) => {
    if (actionRef.current && !actionRef.current.contains(event.target)) {
      setActiveAction(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  return (
    <div className=" w-full px-[50px] py-[32px]">
      <h1 className="text-[21px] leading-[24px] font-[700] text-[#404040]">
        Web Tracker
      </h1>

      {projects.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center h-[75vh]">
          <div>
            <WebTracker />
          </div>
          You don’t have any tracking projects yet.
        </div>
      ) : (
        <div className="px-4 pt-4 bg-white rounded-lg shadow-md">
          <div className="block w-full">
            <ul className="flex justify-between text-[14px] pl-[10px] text-gray-400 mt-[40px] border-[#e6e9ed]">
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
            {projects.map((item) => {
              const todayDate = new Date().toISOString().split("T")[0];

              const todayDateEntry = item.dates?.find(
                (dateItem) => dateItem.date === todayDate
              );

              const relevantDate =
                todayDateEntry || item.dates?.[item.dates.length - 1] || null;

              const latestTimeEntry =
                relevantDate?.activities?.[
                  relevantDate.activities.length - 1
                ] || null;

              return (
                <div
                  key={item._id}
                  className=" w-full p-[10px] border-t border-[#e6e9ed] flex hover:bg-[#fbfdff] "
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
                            fillOpacity="0.85"
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
                    <div className="w-full">
                      <h1 className="text-[17px] text-[#404040] ">
                        {item.name}
                      </h1>
                      {activeAction === false && (
                        <div className="text-[11px] text-[#acb3bb]  flex ">
                          {runningProjectId === item._id ? (
                            <div className="flex w-full">
                              <p>Working on: {projectDescription}</p>

                              <div className="w-full max-w-[11px] flex justify-center items-center ml-[10px]">
                                <svg
                                  fill="#acb3bb"
                                  viewBox="0 0 528.899 528.899"
                                  className=""
                                  onClick={() => setActiveAction(true)}
                                >
                                  <g
                                    id="SVGRepo_bgCarrier"
                                    stroke-width="0"
                                  ></g>
                                  <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></g>
                                  <g id="SVGRepo_iconCarrier">
                                    {" "}
                                    <g>
                                      {" "}
                                      <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981 c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611 C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z"></path>{" "}
                                    </g>{" "}
                                  </g>
                                </svg>
                              </div>
                            </div>
                          ) : (
                            latestTimeEntry &&
                            `Last task duration: ${formatTime(
                              latestTimeEntry.duration
                            )}`
                          )}
                        </div>
                      )}

                      {runningProjectId === item._id && activeAction && (
                        <div className=" w-full pr-[40px]">
                          <input
                            placeholder="Briefly describe what you are doing on"
                            type="text"
                            className="w-full px-[8px] py-[8px] mt-1 text-[13px] text-gray-700 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#4a90e2]"
                            // value={projectDescription}
                            onChange={(e) =>
                              dispatch(setProjectDescription(e.target.value))
                            }
                            onBlur={handleTaskNameSubmit}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleTaskNameSubmit();
                            }}
                            ref={actionRef}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`   flex justify-center  items-center  max-w-[160px] w-full ${
                      runningProjectId === item._id ? "pr-[16px] " : "pl-[90px]"
                    }`}
                  >
                    {runningProjectId === item._id && (
                      <div className="text-[#303030]  font-[600] text-[16px] max-w-[150px] w-full ">
                        {formatTime(timer)}
                      </div>
                    )}
                    {runningProjectId === item._id ? (
                      <button onClick={() => handleTime(item._id)}>
                        <svg
                          fill="#ff0000"
                          height="40px"
                          width="40px"
                          viewBox="0 0 512 512"
                          stroke="#ff0000"
                        >
                          <g stroke-width="0"></g>
                          <g
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke="#CCCCCC"
                            stroke-width="6.144"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M336,320 c0,8.837-7.163,16-16,16H192c-8.837,0-16-7.163-16-16V192c0-8.837,7.163-16,16-16h128c8.837,0,16,7.163,16,16V320z"></path>{" "}
                          </g>
                        </svg>
                      </button>
                    ) : (
                      <button
                        disabled={runningProjectId}
                        onClick={() => startTimer(item._id)}
                      >
                        <svg
                          fill="#00c386"
                          height="40px"
                          width="40px"
                          viewBox="0 0 512 512"
                          stroke="#00c386"
                        >
                          <g stroke-width="0"></g>
                          <g stroke-linecap="round" stroke-linejoin="round"></g>
                          <g>
                            {" "}
                            <path d="M256,0C114.617,0,0,114.615,0,256s114.617,256,256,256s256-114.615,256-256S397.383,0,256,0z M344.48,269.57l-128,80 c-2.59,1.617-5.535,2.43-8.48,2.43c-2.668,0-5.34-0.664-7.758-2.008C195.156,347.172,192,341.82,192,336V176 c0-5.82,3.156-11.172,8.242-13.992c5.086-2.836,11.305-2.664,16.238,0.422l128,80c4.676,2.93,7.52,8.055,7.52,13.57 S349.156,266.641,344.48,269.57z"></path>{" "}
                          </g>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}

export default Page;
