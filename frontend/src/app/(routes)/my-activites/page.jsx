"use client";
import api from "@/api";
import {
  setAllProjects,
  setSelectedProjects,
  setTimeEntriesForProject,
} from "@/app/features/projectSlice";
import Cookies from "js-cookie";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import MyActivites from "@/assets/icons/MyActivites";

import ActivityMsg from "@/assets/icons/ActivityMsg";
import YesAndNo from "@/app/components/common/YesAndNo";
import DropdownDatePicker from "@/app/components/common/DateCalender";
import SelectProjectsBtn from "@/app/components/common/SelectProjectsBtn";
<img src="/loading.gif" alt="Loading..." className="w-16 h-16" />;

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortBy = searchParams.get("sort-by") || "name";
  const sortOrder = searchParams.get("sort-order") || "asc";

  const [activeAction, setActiveAction] = useState(false);
  const [active, setActive] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [singleDate, setSingleDate] = useState(null);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isSingleDate, setIsSingleDate] = useState(false);
  const [filteredProject, setFilteredProject] = useState(null);
  const [actionDelete, setActionDelete] = useState(false);
  const [actionUpdate, setActionUpdate] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [dropDownUpdate, setDropDownUpdate] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [workedFrom, setWorkedFrom] = useState("");
  const [workedTo, setWorkedTo] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { projects, selectedProjects, timeEntriesForProjects } = useSelector(
    (state) => state.project
  );
  const actionRef = useRef(null);
  const today = Date.now();
  const startQuery = startDate.toLocaleDateString("en-GB");
  const endQuery = endDate.toLocaleDateString("en-GB");
  const storedDate = localStorage?.getItem("startQuery");

  if (!storedDate) {
    return localStorage?.setItem("startQuery", startQuery);
  }

  const formatDateRoute = (dateString) => {
    return dateString.toLocaleDateString("en-GB");
  };
  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };
  const formatTimeRange = (start, end) => {
    const formatTime = (dateStr) => {
      const date = new Date(dateStr);
      let hours = date.getHours();
      let minutes = date.getMinutes();

      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;

      minutes = minutes < 10 ? `0${minutes}` : minutes;

      return `${hours}:${minutes} ${ampm}`;
    };

    return `${formatTime(start)} — ${formatTime(end)}`;
  };
  const formatDuration = (durationInSeconds) => {
    if (durationInSeconds < 60) {
      return "Less than a minute";
    } else {
      const minutes = Math.floor(durationInSeconds / 60);
      return `${minutes} minutes`;
    }
  };

  const updatedQueryParams = new URLSearchParams(searchParams);
  const allProjects = updatedQueryParams.get("projects");

  useEffect(() => {
    const fetchProjects = async () => {
      const token = Cookies.get("accessToken");
      if (!token) return router.push("/login");
      setLoading(true);

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
          dispatch(setAllProjects(response.data));
        }
      } catch (error) {
        toast.error(error?.response?.data?.errors || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [sortBy, sortOrder, dispatch, router, actionDelete, selectedProjectId]);

  useEffect(() => {
    const fetchProjectsWithUrlParams = async () => {
      const token = Cookies.get("accessToken");
      const storedStartQuery = localStorage?.getItem("startQuery");

      try {
        if (allProjects === "all") {
          const allProjectIds = projects.map((project) => project._id);
          dispatch(setSelectedProjects(allProjectIds));
          router.push(
            `/my-activites?start=${storedStartQuery}&end=${endQuery}&projects=${projects
              .map((project) => project._id)
              .join("-")}`
          );

          const res = await api.get(
            `/api/v1/project/user/my-activites?start=${storedStartQuery}&end=${endQuery}&projects=${projects
              .map((project) => project._id)
              .join("-")}`,
            {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );
          const filtered = res.data.data.filterProjects;

          const validFilteredProjects = filtered.filter(
            (project) =>
              project?.activities?.length > 0 &&
              project.activities.some(
                (activity) => Object.keys(activity).length > 0
              )
          );

          setFilteredProject(validFilteredProjects);
        } else if (projects) {
          const res = await api.get(
            `/api/v1/project/user/my-activites?start=${storedStartQuery}&end=${endQuery}&projects=${projects
              .map((project) => project._id)
              .join("-")}`,
            {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );
          const filtered = res.data.data.filterProjects;

          const validFilteredProjects = filtered.filter(
            (project) =>
              project?.activities?.length > 0 &&
              project.activities.some(
                (activity) => Object.keys(activity).length > 0
              )
          );

          setFilteredProject(validFilteredProjects);

          const allProjectIds = projects.map((project) => project._id);
          const dataProject = allProjects.split("-");
          if (dataProject !== "none") {
            dispatch(setSelectedProjects(dataProject));
          }
        }
      } catch (error) {
        toast.error("Failed to fetch time entries.");
        console.error(error);
      }
    };

    if (projects.length > 0 && projects) {
      fetchProjectsWithUrlParams();
    }
  }, [projects, dispatch, actionDelete]);

  const handleDeselectSelect = async () => {
    dispatch(
      setSelectedProjects(
        selectedProjects.length === projects.length
          ? []
          : projects.map((project) => project._id)
      )
    );

    router.push(
      `/my-activites?start=${startQuery}&end=${endQuery}&projects=${
        selectedProjects.length > 0
          ? "none"
          : projects.map((project) => project._id).join("-")
      }`
    );
    if (selectedProjects.length <= 0) {
      try {
        const token = Cookies.get("accessToken");
        const res = await api.get(
          `/api/v1/project/user/my-activites?start=${startQuery}&end=${endQuery}&projects=${projects
            .map((project) => project._id)
            .join("-")}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        const filtered = res.data.data.filterProjects;
        setFilteredProject(filtered);
      } catch (error) {
        toast.error("Failed to fetch time entries.");
        console.error(error);
      }
    }
  };

  const toggleProjectSelection = async (projectId) => {
    let updatedSelectedProjects;

    if (selectedProjects.includes(projectId)) {
      updatedSelectedProjects = selectedProjects.filter(
        (id) => id !== projectId
      );
    } else {
      updatedSelectedProjects = [...selectedProjects, projectId];
    }

    dispatch(setSelectedProjects(updatedSelectedProjects));

    updatedQueryParams.set("projects", updatedSelectedProjects.join("-"));

    if (!updatedSelectedProjects.length) {
      updatedQueryParams.delete("projects");
    }
    if (updatedSelectedProjects.length > 0) {
      try {
        const token = Cookies.get("accessToken");
        const res = await api.get(
          `/api/v1/project/user/my-activites?start=${startQuery}&end=${endQuery}&projects=${
            updatedSelectedProjects.length > 0
              ? updatedSelectedProjects.join("-")
              : "none"
          }`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        const filtered = res.data.data.filterProjects;
        setFilteredProject(filtered);
      } catch (error) {
        toast.error("Failed to fetch time entries.");
        console.error(error);
      }
    }

    router.push(
      `/my-activites?start=${startQuery}&end=${endQuery}&projects=${
        updatedSelectedProjects.length > 0
          ? updatedSelectedProjects.join("-")
          : "none"
      }`
    );

    if (!selectedProjects.includes(projectId)) {
      try {
        const token = Cookies.get("accessToken");
        const res = await api.get(
          `/api/v1/project/user/my-activites?start=${startQuery}&end=${endQuery}&projects=${
            updatedSelectedProjects.length > 0
              ? updatedSelectedProjects.join("-")
              : "none"
          }`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        const filtered = res.data.data.filterProjects;
        setFilteredProject(filtered);
      } catch (error) {
        toast.error("Failed to fetch time entries.");
        console.error(error);
      }
    } else {
      dispatch(
        setTimeEntriesForProject(
          timeEntriesForProjects.filter(
            (entry) => entry.projectId !== projectId
          )
        )
      );
    }
  };

  const handleAction = (id) => {
    setActive(active === id ? null : id);
  };

  const handleClickOutside = (event) => {
    if (actionRef.current && !actionRef.current.contains(event.target)) {
      setActiveAction(null);
      setActive(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleDatechange = async (date) => {
    const newStartDate = await formatDateRoute(date);
    localStorage?.setItem("startQuery", newStartDate);
    router.push(
      `/my-activites?start=${newStartDate}&end=${endQuery}&projects=${
        selectedProjects.length > 0 ? selectedProjects.join("-") : "none"
      }`
    );

    try {
      const token = Cookies.get("accessToken");
      const res = await api.get(
        `/api/v1/project/user/my-activites?start=${newStartDate}&end=${endQuery}&projects=${
          selectedProjects.length > 0 ? selectedProjects.join("-") : "none"
        }`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      const filtered = res.data.data.filterProjects;

      const validFilteredProjects = filtered.filter(
        (project) =>
          project?.activities?.length > 0 &&
          project.activities.some(
            (activity) => Object.keys(activity).length > 0
          )
      );

      setFilteredProject(validFilteredProjects);
    } catch (error) {
      toast.error("Please select project.");
    }
  };

  const handleDeleteProject = async () => {
    setLoading(true);
    const token = Cookies.get("accessToken");

    try {
      const response = await api.delete(
        `/api/v1/project/user/${selectedProjectId}/my-activites`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setActionDelete(false);

      // if (response.status === 200) {
      //   setActionDelete(false);
      //   toast.success("Project Deleted successfully");
      //   fetchProjects();
      // }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (projectId) => {
    setSelectedProjectId(projectId);
    setActionDelete(true);
  };

  const handleUpdate = (projectId) => {
    setSelectedProjectId(projectId);

    setActionUpdate(true);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const formData = {
      projectName,
      activityDescription,
      duration,
      startDate,
      endDate,
    };

    const token = Cookies.get("accessToken");

    try {
      const response = await api.put(
        `/api/v1/project/user/${selectedProjectId}/my-activites`,
        {
          project_name: projectName,
          task_name: activityDescription,
          start_date: startDate,
          duration: duration,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setActionUpdate(false);
      // if (response.status === 200) {
      //   setActionDelete(false);
      //   toast.success("Project Deleted successfully");
      //   fetchProjects();
      // }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-[50px] py-[32px]">
      <h1 className="text-[21px] leading-[24px] font-[700] text-[#404040]">
        My Activities
      </h1>

      {actionDelete && (
        <YesAndNo
          loading={loading}
          heading={" Delete this task?"}
          para={
            " Deleting this project will Delete it and all its related data & reports on TechTracker for all users working on the project.You cannot restore it"
          }
          yes={handleDeleteProject}
          no={() => setActionDelete(false)}
          action={"delete"}
        />
      )}
      {actionUpdate && (
        <div className="w-full fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-[552px] p-[40px]">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Activity
              </h3>
              <button
                disabled={loading}
                onClick={() => {
                  setActionUpdate(false);
                }}
                className="text-[#fff] w-full max-w-[25px] bg-gray-400 rounded-3xl mt-[-40px]"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Project Name */}
              <div className="my-4">
                <label className="block font-semibold">Project</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* Activity Description */}
              <div className="my-4">
                <label className="block font-semibold">
                  Activity Description (Optional)
                </label>
                <input
                  type="text"
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* Date Picker and Duration */}

              <DropdownDatePicker onDateChange={handleDatechange} />

              {/* Duration */}
              <div className="my-4">
                <label className="block font-semibold">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* Worked From and To */}
              <div className="my-4">
                <label className="block font-semibold">Worked From</label>
                <input
                  type="text"
                  value={workedFrom}
                  onChange={(e) => setWorkedFrom(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <label className="block font-semibold mt-4">Worked To</label>
                <input
                  type="text"
                  value={workedTo}
                  onChange={(e) => setWorkedTo(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#35bf8a] text-white font-semibold rounded-md"
              >
                Update Activity
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-screen  w-full flex-col ">
          <img src="/loserr.gif" alt="Loading..." className="w-16 h-16" />
          Loading...
        </div>
      ) : (
        <>
          {projects.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center h-[75vh]">
              <MyActivites />

              <div className="max-w-[448px] w-full text-center">
                <p className="mt-[20px]">
                  You have no tracked activity to report yet.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full flex justify-between mt-[40px] items-center">
                <SelectProjectsBtn
                  projects={projects}
                  selectedProjects={selectedProjects}
                  toggleProjectSelection={toggleProjectSelection}
                  handleDeselectSelect={handleDeselectSelect}
                  extraClasses={"mt-[45px]"}
                />
                {/* date btn */}

                <DropdownDatePicker
                  onDateChange={handleDatechange}
                  extraClasses={"right-12"}
                />
              </div>
              {filteredProject?.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center h-[75vh]">
                  <MyActivites />

                  <div className="max-w-[448px] w-full text-center">
                    <p className="mt-[20px]">
                      You don’t have any activities yet. TopTracker desktop
                      application or use Web Tracker to start tracking your work
                      immediately.
                    </p>
                  </div>
                </div>
              ) : (
                <div className=" bg-white rounded-lg shadow-md">
                  <div className="block w-full">
                    <ul className="flex justify-between text-[14px] pl-[10px] text-gray-400 mt-[40px] border-[#e6e9ed]">
                      {/* Aug 21Tracked 1 minute content */}
                    </ul>
                    {/* entries with respect to selected project */}

                    <div className="px-4 pt-4 bg-white rounded-lg shadow-md ">
                      {selectedProjects.length > 0 ? (
                        filteredProject
                          ?.filter((project) => project?.activities?.length > 0)
                          .map((project, index) => {
                            return (
                              <div key={index} className="mb-4">
                                <h2>{project.name}</h2>
                                <ul className="flex flex-col gap-[3px]">
                                  <div>{formatDate(project.date)}</div>
                                  <div>
                                    {project?.activities?.map((items) =>
                                      Object.values(items).map(
                                        (entry, index) => {
                                          return (
                                            <li
                                              key={index}
                                              className="text-gray-600 flex gap-[20px] py-[16px] px-[8px] border-y-[#e6e9ed] border-y"
                                            >
                                              <div className="max-w-[144px] w-full">
                                                <div className="text-[13px] text-[#404040] font-[600]">
                                                  {/* created at */}
                                                  at{" "}
                                                  {formatTimeRange(
                                                    entry.start_time,
                                                    entry.end_time
                                                  )}
                                                </div>
                                                {/* less than a minute */}
                                                <div className="text-[#acb3bb] text-[11px]">
                                                  {formatDuration(
                                                    entry.duration
                                                  )}
                                                </div>
                                              </div>
                                              <div className="w-full">
                                                <div className="text-[#303030] text-[17px]">
                                                  {entry.task_name === ""
                                                    ? "Unnamed Activity"
                                                    : entry.task_name}
                                                </div>
                                                <div className="w-full text-[#acb3bb] text-[11px]">
                                                  {entry.project_name}
                                                </div>
                                              </div>
                                              <div className="w-full max-w-[336px] flex gap-[30px]">
                                                <div className="max-w-[125px] w-full">
                                                  <div className="text-[13px]">
                                                    0 keyboard hits
                                                  </div>
                                                  <div className="w-full text-[#acb3bb] text-[11px]">
                                                    0 mouseclicks
                                                  </div>
                                                </div>
                                                {/* Web Tracker Activity */}
                                                <div className="max-w-[172px] w-full flex">
                                                  <div className="max-w-[42px] w-full">
                                                    {/* Activity Msg */}
                                                    <ActivityMsg />
                                                  </div>
                                                  <div className="text-[11px] text-[#acb3bb] w-full flex items-center">
                                                    Web Tracker Activity
                                                  </div>
                                                  <div
                                                    className="flex items-center text-[20px] cursor-pointer"
                                                    onClick={() =>
                                                      handleAction(entry._id)
                                                    }
                                                  >
                                                    ...
                                                  </div>
                                                  {active === entry._id && (
                                                    <div
                                                      className="absolute mt-[40px] max-w-[200px] w-full p-[8px] bg-white rounded-md shadow-lg z-20"
                                                      ref={actionRef}
                                                    >
                                                      <ul className="py-1">
                                                        <button
                                                          onClick={() =>
                                                            handleUpdate(
                                                              entry._id
                                                            )
                                                          }
                                                          className="w-full text-gray-700 px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer items-start flex"
                                                        >
                                                          Edit
                                                        </button>
                                                        <button
                                                          onClick={() =>
                                                            handleDelete(
                                                              entry._id
                                                            )
                                                          }
                                                          className="text-red-600 w-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer items-start flex"
                                                        >
                                                          Delete
                                                        </button>
                                                      </ul>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </li>
                                          );
                                        }
                                      )
                                    )}
                                  </div>
                                </ul>
                              </div>
                            );
                          })
                      ) : (
                        <div className="pb-[20px]">No projects selected.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      <Toaster />
    </div>
  );
}

export default Page;
