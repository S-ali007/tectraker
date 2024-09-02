"use client";
import api from "@/api";
import {
  setAllProjects,
  setSelectedProjects,
  setTimeEntriesForProject,
} from "@/app/features/projectSlice";
import MyActivites from "@/assets/icons/MyActivites";
import WebTracker from "@/assets/icons/WebTracker";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

function Page() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("sort-by");
  const sortBy = searchParams.get("sort-by") || "name";
  const sortOrder = searchParams.get("sort-order") || "asc";
  const [activeAction, setActiveAction] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const [runningProjectId, setRunningProjectId] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const { projects, selectedProjects, timeEntriesForProjects } = useSelector(
    (state) => state.project
  );

  const actionRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleActions = () => {
    setActiveAction(true);
  };

  const handleClickOutside = (event) => {
    if (actionRef.current && !actionRef.current.contains(event.target)) {
      setActiveAction(null);
    }
  };
  const toggleProjectSelection = async (projectId) => {
    if (selectedProjects.includes(projectId)) {
      dispatch(
        setSelectedProjects(selectedProjects.filter((id) => id !== projectId))
      );
      dispatch(
        setTimeEntriesForProject(
          timeEntriesForProjects.filter(
            (entry) => entry.projectId !== projectId
          )
        )
      );
    } else {
      dispatch(setSelectedProjects([...selectedProjects, projectId]));

      try {
        const res = await api.get(`/api/v1/project/${projectId}/time-entries`);

        dispatch(
          setTimeEntriesForProject([
            ...timeEntriesForProjects,
            { projectId, timeEntries: res.data },
          ])
        );
      } catch (error) {
        console.error("Error fetching time entries:", error);
        toast.error("Failed to fetch time entries.");
      }
    }
  };

  const options = { month: "long", day: "numeric" };

  const handleCustomRange = (rangeType) => {
    switch (rangeType) {
      case "currentWeek":
        setStartDate(startOfWeek(new Date()));
        setEndDate(endOfWeek(new Date()));
        break;
      case "last7Days":
        setStartDate(addDays(new Date(), -7));
        setEndDate(new Date());
        break;
      case "currentMonth":
        setStartDate(startOfMonth(new Date()));
        setEndDate(endOfMonth(new Date()));
        break;
      default:
        break;
    }
    setIsDateDropdownOpen(false);
  };

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      return router.push("/login");
    }

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
  }, [tab, sortBy, sortOrder, dispatch, router]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  return (
    <div className=" w-full px-[50px] py-[32px]">
      <h1 className="text-[21px] leading-[24px] font-[700] text-[#404040]">
        My Activities
      </h1>
      <div className="w-full flex justify-between mt-[40px] items-center">
        <button
          onClick={() => handleActions()}
          className="max-w-[180px] flex w-full px-[16px] py-[11px] bg-[#acb3bb] opacity-[0.3] rounded-[6px] border-[#f0f1f4] border justify-around items-center"
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
          <div className="text-[14px] text-[#000] opacity-100">
            Select Project{" "}
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
            className="absolute  mt-[190px] max-w-[240px] w-full p-[8px] bg-white rounded-md shadow-lg z-20"
            ref={actionRef}
          >
            <button
              className="w-full text-left px-4 py-2  text-gray-700 hover:bg-gray-100 text-[13px]"
              onClick={() =>
                dispatch(
                  setSelectedProjects(
                    selectedProjects.length === projects.length
                      ? []
                      : projects.map((project) => project._id)
                  )
                )
              }
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
            {`${startDate.toLocaleDateString(
              "en-GB",
              options
            )} — ${endDate.toLocaleDateString("en-GB", options)}`}
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
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
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
                selectedProjects.map((projectId) => {
                  const project = projects.find(
                    (proj) => proj._id === projectId
                  );

                  return (
                    <div key={projectId} className="mb-4">
                      <ul className=" flex flex-col gap-[20px]">
                        {project.timeEntries.map((entry, index) => (
                          <li
                            key={index}
                            className="text-gray-600 flex py-[16px] px-[8px] border-y-[#e6e9ed] border-y"
                          >
                            <div className=" max-w-[144px] w-full">
                              <div className="text-[13px]">
                                {/* created at */}
                                {/* at {entry.start_time} - {entry.end_time} */}
                              </div>
                              {/* less then a minute */}
                              <div className="text-[#acb3bb] text-[11px]">
                                {entry.duration}
                              </div>
                            </div>
                            <div className="max-w-[626px] w-full ">
                              <div className="text-[13px] text-[#303030]">
                                {entry.task_name}
                              </div>
                              <div className="w-full text-[#acb3bb] text-[11px]">
                                {project.name}
                              </div>
                            </div>
                            <div className="max-w-[144px] w-full ">
                              <div className="text-[13px]">0 keyboard hits</div>
                              <div className="w-full text-[#acb3bb] text-[11px]">
                                0 mouseclicks
                              </div>
                            </div>
                          </li>
                        ))}
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
