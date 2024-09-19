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
import DatePicker from "react-datepicker";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { format } from "date-fns";

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortBy = searchParams.get("sort-by") || "name";
  const sortOrder = searchParams.get("sort-order") || "asc";
  const projectIdsFromParams = searchParams.get("projects")?.split("-") || [];

  const [activeAction, setActiveAction] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [singleDate, setSingleDate] = useState(null);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isSingleDate, setIsSingleDate] = useState(false);
  const [filteredProject, setFilteredProject] = useState(null);

  const dispatch = useDispatch();
  const { projects, selectedProjects, timeEntriesForProjects } = useSelector(
    (state) => state.project
  );
  const actionRef = useRef(null);
  const today = Date.now();
  const startQuery = startDate.toLocaleDateString("en-GB");
  const endQuery = endDate.toLocaleDateString("en-GB");
  const storedDate = localStorage.getItem("startQuery");

  if (!storedDate) {
    return localStorage.setItem("startQuery", startQuery);
  }
  const [day, month, year] = storedDate.split("/").map(Number);
  const parsedDate = new Date(year, month - 1, day);
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
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const ampm = hours <= 12 ? "pm" : "am";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${formattedHours}:${formattedMinutes}${ampm}`;
    };

    return `${formatTime(start)} — ${formatTime(end)}`;
  };
  const updatedQueryParams = new URLSearchParams(searchParams);
  const allProjects = updatedQueryParams.get("projects");

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

        if (response) {
          dispatch(setAllProjects(response.data));
        }
      } catch (error) {
        toast.error(error?.response?.data?.errors || "An error occurred");
      }
    };

    fetchProjects();
  }, [sortBy, sortOrder, dispatch, router]);

  useEffect(() => {
    const fetchProjectsWithUrlParams = async () => {
      const token = Cookies.get("accessToken");
      const storedStartQuery = localStorage.getItem("startQuery");

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
        setFilteredProject(filtered);
      } else if (projects) {
        try {
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
          setFilteredProject(filtered);
          const allProjectIds = projects.map((project) => project._id);
          const dataProject = allProjects.split("-");
          if (dataProject != "none") {
            dispatch(setSelectedProjects(allProjects.split("-")));
          }
        } catch (error) {
          toast.error("Failed to fetch time entries.");
          console.error(error);
        }
      }
    };

    if (projects.length > 0 && projects) {
      fetchProjectsWithUrlParams();
    }
  }, [projects, dispatch]);

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
        console.log(filtered, "dddddddddd");
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

  const handleActions = () => {
    setActiveAction(true);
  };

  const handleClickOutside = (event) => {
    if (actionRef.current && !actionRef.current.contains(event.target)) {
      setActiveAction(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleCustomRange = (rangeType) => {
    switch (rangeType) {
      case "currentWeek":
        setStartDate(startOfWeek(new Date()));
        setEndDate(new Date());
        break;
      case "last7Days":
        setStartDate(addDays(new Date(), -7));
        setEndDate(new Date());
        break;
      case "currentMonth":
        setStartDate(startOfMonth(new Date()));
        setEndDate(new Date());
        break;
      default:
        break;
    }
    setIsDateDropdownOpen(false);
  };

  const handleDatechange = async (date) => {
    setStartDate(date);
    const newStartDate = await formatDateRoute(date);
    localStorage.setItem("startQuery", newStartDate);
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
      setFilteredProject(filtered);
    } catch (error) {
      toast.error("Please select project.");
    }
  };

  return (
    <div className=" w-full px-[50px] py-[32px]">
      <h1 className="text-[21px] leading-[24px] font-[700] text-[#404040]">
        My Activities
      </h1>
      <div className="w-full flex justify-between mt-[40px] items-center">
        <button
          onClick={() => handleActions()}
          className={`max-w-[193px] flex w-full px-[16px] py-[11px]  ${
            selectedProjects.length ? "opacity-100" : "opacity-[0.6]"
          }   hover:bg-[#e7f4ff] bg-[#f0f1f4]  rounded-[6px] border-[#f0f1f4] border justify-around items-center`}
        >
          {/* svg */}
          <div>
            <svg
              fill="#000000"
              height="15px"
              width="15px"
              version="1.1"
              viewBox="0 0 512 512"
              enable-background="new 0 0 512 512"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g>
                  {" "}
                  <g>
                    {" "}
                    <g>
                      {" "}
                      <path d="m460.2,272.6h-52.3v-15.7c0-11.3-9.1-20.4-20.4-20.4-11.3,0-20.4,9.1-20.4,20.4v15.7h-222.1v-15.7c0-11.3-9.1-20.4-20.4-20.4-11.3,0-20.4,9.1-20.4,20.4v15.7h-52.4v-136.3h408.3v136.3h0.1zm-408.4,187.6v-146.7h52.3v15.7c0,11.3 9.1,20.4 20.4,20.4 11.3,0 20.4-9.1 20.4-20.4v-15.7h222v15.7c0,11.3 9.1,20.4 20.4,20.4 11.3,0 20.4-9.1 20.4-20.4v-15.7h52.3v146.7h-408.2-1.42109e-14zm130.8-408.4h131.8v41.8h-131.8v-41.8zm298,43.6h-125.4v-52.1c0-17.8-14.5-32.3-32.3-32.3h-148.8c-17.8,0-32.3,14.5-32.3,32.3v52.1h-110.4c-11.3,0-20.4,9.1-20.4,20.4v364.7c0,11.3 9.1,20.4 20.4,20.4h449.2c11.3,0 20.4-9.1 20.4-20.4v-364.7c5.68434e-14-11.2-9.1-20.4-20.4-20.4z"></path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
          </div>
          {/* select */}
          <div
            className={`text-[14px] text-[#000] 
              opacity-100
             `}
          >
            {selectedProjects.length
              ? `${selectedProjects.length} Projects Selected `
              : "Select Project"}
          </div>
          {/* arrow */}
          <svg
            fill="#000000"
            height="10px"
            width="10px"
            version="1.1"
            id="Layer_1"
            viewBox="0 0 330 330"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                id="XMLID_225_"
                d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
              ></path>{" "}
            </g>
          </svg>
        </button>
        {activeAction && (
          <div
            className="absolute  mt-[180px] max-w-[240px] w-full p-[8px] bg-white rounded-md shadow-lg z-20"
            ref={actionRef}
          >
            <button
              className={`w-full text-left px-4 py-2  text-gray-700 hover:bg-gray-100 text-[14px] font-[600]`}
              onClick={() => handleDeselectSelect()}
            >
              {selectedProjects.length === projects.length
                ? "Deselect All Projects"
                : "Select All Projects"}
            </button>
            {projects.map((project) => (
              <div key={project._id} className="flex items-center px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project._id)}
                  onChange={() => toggleProjectSelection(project._id)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">{project.name}</label>
              </div>
            ))}
          </div>
        )}

        {/* date btn */}
        <div className=" inline-block text-left">
          <button
            type="button"
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="inline-flex justify-between items-center gap-[5px] w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            <svg
              className="max-w-[20px] w-full"
              fill="#000000"
              viewBox="0 0 512 512"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g>
                  {" "}
                  <g>
                    {" "}
                    <path d="M490.6,43H381.1V11h-20.9v32H151.7V11h-20.9v32H21.4C15.2,43,11,47.2,11,53.6v436.7c0,6.4,4.2,10.7,10.4,10.7h469.1 c6.3,0,10.4-4.3,10.4-10.7V53.6C501,47.2,496.8,43,490.6,43z M480.1,479.7H31.9V64.3h99v32h20.9v-32h208.5v32h20.9v-32h99V479.7z"></path>{" "}
                    <path d="m84,170.8c-6.3,0-10.4,4.3-10.4,10.7v245c0,6.4 4.2,10.7 10.4,10.7h344c6.3,0 10.4-4.3 10.4-10.7v-245c0-6.4-4.2-10.7-10.4-10.7h-344zm333.6,245h-323.2v-223.7h323.2v223.7z"></path>{" "}
                    <rect width="20.9" x="214.3" y="232.6" height="21.3"></rect>{" "}
                    <rect width="20.9" x="276.9" y="232.6" height="21.3"></rect>{" "}
                    <rect width="20.9" x="339.4" y="232.6" height="21.3"></rect>{" "}
                    <rect width="20.9" x="151.7" y="293.3" height="21.3"></rect>{" "}
                    <rect width="20.9" x="214.3" y="293.3" height="21.3"></rect>{" "}
                    <rect width="20.9" x="276.9" y="293.3" height="21.3"></rect>{" "}
                    <rect width="20.9" x="339.4" y="293.3" height="21.3"></rect>{" "}
                    <rect width="20.9" x="151.7" y="355.1" height="21.3"></rect>{" "}
                    <rect width="20.9" x="214.3" y="355.1" height="21.3"></rect>{" "}
                    <rect width="20.9" x="276.9" y="355.1" height="21.3"></rect>{" "}
                    <rect width="20.9" x="339.4" y="355.1" height="21.3"></rect>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
            {`${format(parsedDate, "d MMMM")} — ${formatDate(endDate)}`}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isDateDropdownOpen && (
            <div className="  absolute right-[50px] mt-2 max-w-[377px] w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1 flex w-full ">
                <div className="max-w-[130px] w-full">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleCustomRange("currentWeek")}
                  >
                    Current week
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleCustomRange("last7Days")}
                  >
                    Last 7 days
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleCustomRange("currentMonth")}
                  >
                    Current month
                  </button>
                </div>
                <DatePicker
                  selectsStart
                  selected={isSingleDate ? singleDate : startDate}
                  onChange={(date) => handleDatechange(date)}
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={today}
                  inline
                />
              </div>
            </div>
          )}
        </div>
      </div>
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
        <div className=" bg-white rounded-lg shadow-md">
          <div className="block w-full">
            <ul className="flex justify-between text-[14px] pl-[10px] text-gray-400 mt-[40px] border-[#e6e9ed]">
              {/* Aug 21Tracked 1 minute content */}
            </ul>
            {/* entries with respect to selected project */}

            <div className="px-4 pt-4 bg-white rounded-lg shadow-md ">
              {selectedProjects.length > 0 ? (
                filteredProject?.map((project, index) => {
                  return (
                    <div key={index} className="mb-4">
                      {/* <h2>{project.name}</h2> */}
                      <ul className=" flex flex-col gap-[3px]">
                        <div>{formatDate(project.date)}</div>
                        <div>
                          {project?.activities?.map((items) =>
                            Object.values(items).map((entry, index) => {
                              return (
                                <li
                                  key={index}
                                  className="text-gray-600 flex gap-[20px] py-[16px] px-[8px] border-y-[#e6e9ed] border-y"
                                >
                                  <div className=" max-w-[144px] w-full">
                                    <div className="text-[13px] text-[#404040] font-[600]">
                                      {/* created at */}
                                      at{" "}
                                      {formatTimeRange(
                                        entry.start_time,
                                        entry.end_time
                                      )}
                                    </div>
                                    {/* less then a minute */}
                                    <div className="text-[#acb3bb] text-[11px]">
                                      {entry.duration}
                                    </div>
                                  </div>
                                  <div className=" w-full ">
                                    <div className=" text-[#303030] text-[17px]">
                                      {entry.task_name === ""
                                        ? "Unamed Activity"
                                        : entry.task_name}
                                    </div>
                                    <div className="w-full text-[#acb3bb] text-[11px]">
                                      {project.name}
                                    </div>
                                  </div>
                                  <div className="w-full max-w-[336px] flex gap-[25px]">
                                    <div className="max-w-[144px] w-full ">
                                      <div className="text-[13px]">
                                        0 keyboard hits
                                      </div>
                                      <div className="w-full text-[#acb3bb] text-[11px]">
                                        0 mouseclicks
                                      </div>
                                    </div>
                                    {/* Web Tracker Activity */}
                                    <div className="max-w-[15 2px] w-full flex">
                                      <div className="max-w-[42px] w-full">
                                        <svg
                                          viewBox="0 0 50 50"
                                          id="Message_And_Communication_Icons"
                                          version="1.1"
                                          fill="#000000"
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
                                              <g>
                                                {" "}
                                                <g>
                                                  {" "}
                                                  <path
                                                    d="M36.7,12.3c2.3,3,3.7,6.7,3.7,10.7c0,9.6-7.8,17.4-17.4,17.4c-4,0-7.7-1.4-10.7-3.7 c3.2,4.1,8.1,6.7,13.7,6.7c9.6,0,17.4-7.8,17.4-17.4C43.4,20.4,40.8,15.5,36.7,12.3z"
                                                    style={{ fill: "#4DE0F9" }}
                                                  ></path>{" "}
                                                </g>{" "}
                                              </g>{" "}
                                              <g>
                                                {" "}
                                                <g>
                                                  {" "}
                                                  <path
                                                    d="M25,43c-9.9,0-18-8.1-18-18S15.1,7,25,7s18,8.1,18,18S34.9,43,25,43z M25,8.2 C15.7,8.2,8.2,15.7,8.2,25S15.7,41.8,25,41.8S41.8,34.3,41.8,25S34.3,8.2,25,8.2z"
                                                    style={{ fill: "#0D5FC3" }}
                                                  ></path>{" "}
                                                </g>{" "}
                                              </g>{" "}
                                              <g>
                                                {" "}
                                                <g>
                                                  {" "}
                                                  <g>
                                                    {" "}
                                                    <path
                                                      d="M15.6,32.8h-1.2c-0.3,0-0.6-0.3-0.6-0.6V19.4c0-0.3,0.3-0.6,0.6-0.6h13.8V20H15v11.6h0.6V32.8z"
                                                      style={{
                                                        fill: "#0D5FC3",
                                                      }}
                                                    ></path>{" "}
                                                  </g>{" "}
                                                </g>{" "}
                                                <g>
                                                  {" "}
                                                  <g>
                                                    {" "}
                                                    <path
                                                      d="M34.6,32.8H20.2v-1.2H34V20.5l-3.1,2l-0.6-1l4-2.5c0.2-0.1,0.4-0.1,0.6,0 c0.2,0.1,0.3,0.3,0.3,0.5v12.8C35.2,32.5,34.9,32.8,34.6,32.8z"
                                                      style={{
                                                        fill: "#0D5FC3",
                                                      }}
                                                    ></path>{" "}
                                                  </g>{" "}
                                                </g>{" "}
                                                <g>
                                                  {" "}
                                                  <g>
                                                    {" "}
                                                    <rect
                                                      height="1.2"
                                                      style={{
                                                        fill: "#0D5FC3",
                                                      }}
                                                      transform="matrix(0.8439 0.5366 -0.5366 0.8439 14.7176 -6.5462)"
                                                      width="9.9"
                                                      x="13.7"
                                                      y="21.4"
                                                    ></rect>{" "}
                                                  </g>{" "}
                                                </g>{" "}
                                              </g>{" "}
                                              <g>
                                                {" "}
                                                <g>
                                                  {" "}
                                                  <rect
                                                    height="34.9"
                                                    style={{ fill: "#0D5FC3" }}
                                                    transform="matrix(0.7071 0.7071 -0.7071 0.7071 25 -10.3553)"
                                                    width="1.2"
                                                    x="24.4"
                                                    y="7.5"
                                                  ></rect>{" "}
                                                </g>{" "}
                                              </g>{" "}
                                              <g>
                                                {" "}
                                                <g>
                                                  {" "}
                                                  <path
                                                    d="M23.3,10.8l-0.1-1.2c0.6-0.1,1.2-0.1,1.8-0.1v1.2C24.4,10.7,23.9,10.8,23.3,10.8z"
                                                    style={{ fill: "#4DE0F9" }}
                                                  ></path>{" "}
                                                </g>{" "}
                                              </g>{" "}
                                              <g>
                                                {" "}
                                                <g>
                                                  {" "}
                                                  <path
                                                    d="M17,13.1l-0.7-1c1.5-1,3.1-1.7,4.8-2.2l0.3,1.2C19.9,11.6,18.4,12.2,17,13.1z"
                                                    style={{ fill: "#4DE0F9" }}
                                                  ></path>{" "}
                                                </g>{" "}
                                              </g>{" "}
                                            </g>{" "}
                                          </g>
                                        </svg>
                                      </div>
                                      <div className="text-[11px] text-[#acb3bb] w-full flex items-center">
                                        Web Tracker Activity
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })
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

      <Toaster />
    </div>
  );
}

export default Page;
