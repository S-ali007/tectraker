"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/api";
import {
  resetProject,
  setAllArchiveProjects,
  setAllProjects,
} from "@/app/features/projectSlice";

import toast from "react-hot-toast";
import YesAndNo from "@/app/components/common/YesAndNo";
import ActiveProjects from "@/assets/icons/ActiveProjects";
import ArchiveProjects from "@/assets/icons/ArchiveProjects";
import Cookies from "js-cookie";

function ProjectListPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const sortBy = searchParams.get("sortBy") || "name";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeAction, setActiveAction] = useState(null);
  const [actionArchive, setActionArchive] = useState(false);
  const [actionDelete, setActionDelete] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const { projects, currentProjectId, archiveProjects } = useSelector(
    (state) => state.project
  );
  const actionRef = useRef(null);

  const handleSort = (field) => {
    const newSortOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    router.push(
      `/projects?tab=active&sortBy=${field}&sortOrder=${newSortOrder}`
    );
  };

  const orderByName = () => handleSort("name");
  const orderByCreation = () => handleSort("created_at");

  const formatDate = (dateString) => {
    const options = { month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const handleCreateNew = () => {
    dispatch(resetProject());
    router.push("/projects/create?step=general");
  };

  const handleActions = (id) => {
    setActiveAction(activeAction === id ? null : id);
  };

  const handleClickOutside = (event) => {
    if (actionRef.current && !actionRef.current.contains(event.target)) {
      setActiveAction(null);
    }
  };

  const handleArchive = (projectId) => {
    setSelectedProjectId(projectId);
    setActionArchive(true);
  };
  const handleDelete = (projectId) => {
    setSelectedProjectId(projectId);
    setActionDelete(true);
  };
  const handleConfirmArchive = async () => {
    const token = Cookies.get("accessToken");

    try {
      const response = await api.put(
        `/api/v1/project/${selectedProjectId}/archive`,
        {},
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Project archived successfully");

        fetchProjects();
        setActionArchive(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.errors || "An error occurred");
    }
  };

  const fetchProjects = async () => {
    const token = Cookies.get("accessToken");

    try {
      const response = await api.get(
        `/api/v1/project/projects?tab=${tab}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response) {
        const projectAll = response.data;

        if (tab === "active") {
          dispatch(setAllProjects(projectAll));
        } else if (tab === "archive") {
          dispatch(setAllArchiveProjects(projectAll));
        }
      }
    } catch (error) {
      dispatch(setAllProjects([]));
    }
  };

  const handleDeleteProject = async () => {
    const token = Cookies.get("accessToken");

    try {
      const response = await api.delete(
        `/api/v1/project/${selectedProjectId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status === 200) {
        setActionDelete(false);
        toast.success("Project Deleted successfully");
        fetchProjects();
      }
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  useEffect(() => {
    const token = Cookies.get("accessToken");

    const fetchProjects = async () => {
      try {
        const response = await api.get(
          `/api/v1/project/projects?tab=${tab}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response) {
          const projectAll = response.data;

          if (tab === "active") {
            dispatch(setAllProjects(projectAll));
          } else if (tab === "archive") {
            dispatch(setAllArchiveProjects(projectAll));
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.errors || "An error occurred");
      }
    };

    if (tab === "active" || tab === "archive") {
      fetchProjects();
    }
  }, [tab, sortBy, sortOrder, dispatch]);
  return (
    <div className="max-w-[1440px] w-full px-[50px] py-[32px]">
      <div className="w-full flex">
        <h1 className="w-full text-[21px] leading-[24px] font-[700] text-[#404040] ">
          Projects
        </h1>
        <button
          onClick={handleCreateNew}
          className="w-full bg-[#00C386] text-[#fff] text-center max-w-[104px] px-[10px] text-[13px] leading-[16px] py-[10px] rounded-[5px]"
        >
          New Project
        </button>
      </div>

      <div className="w-full py-[32px]">
        <div className="max-w-[694px] w-full   flex gap-[30px] text-[#404040] text-[15px] leading-[15px] font-[600]">
          <Link
            href={"/projects?tab=active&sortBy=project-name&sortOrder=asc"}
            className={`pb-[5px] ${
              tab === "active" && "border-b-[#004F98] border-b-[2px]"
            }`}
          >
            Active {projects.length > 0 ? `(${projects.length})` : ""}
          </Link>
          <Link
            href={"/projects?tab=archive&sortBy=project-name&sortOrder=asc"}
            className={`pb-[5px] ${
              tab === "archive" && "border-b-[#004F98] border-b-[2px]"
            }`}
          >
            Archive{" "}
            {archiveProjects.length > 0 ? `(${archiveProjects.length})` : ""}
          </Link>
        </div>
        {actionArchive && (
          <YesAndNo
            heading={"Archive this project?"}
            para={
              "Archiving this project will hide it and all its related data from most screens & reports on TopTracker for all users working on the project. You can fully restore it later from the archived projects tab."
            }
            yes={handleConfirmArchive}
            no={() => setActionArchive(false)}
            action={"archive"}
          />
        )}
        {actionDelete && (
          <YesAndNo
            heading={" Delete this project?"}
            para={
              " Deleting this project will Delete it and all its related data & reports on TechTracker for all users working on the project.You cannot restore it"
            }
            yes={handleDeleteProject}
            no={() => setActionDelete(false)}
            action={"delete"}
          />
        )}

        {projects.length != 0 && tab == "active" && (
          <div className="block w-full">
            {/* orders-ALL */}
            <ul class=" flex justify-between text-[14px] pl-[10px] text-gray-400 mt-[40px] pb-[15px]  border-b border-[#e6e9ed]">
              <div className="flex items-center  w-full gap-[30px]">
                {/* name */}

                <button
                  title="Ascending ordering by Name"
                  type="button"
                  value="projectname"
                  className="flex items-center gap-[10px]"
                  onClick={orderByName}
                >
                  Name
                  <div className="max-w-[8px] w-full ">
                    {" "}
                    <svg viewBox="0 0 256 256">
                      <defs></defs>
                      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                        <path
                          d="M 90 65.75 c 0 0.896 -0.342 1.792 -1.025 2.475 c -1.366 1.367 -3.583 1.367 -4.949 0 L 45 29.2 L 5.975 68.225 c -1.367 1.367 -3.583 1.367 -4.95 0 c -1.366 -1.367 -1.366 -3.583 0 -4.95 l 41.5 -41.5 c 1.366 -1.367 3.583 -1.367 4.949 0 l 41.5 41.5 C 89.658 63.958 90 64.854 90 65.75 z"
                          transform=" matrix(1 0 0 1 0 0) "
                          stroke-linecap="round"
                        />
                      </g>
                    </svg>{" "}
                    <svg width="6px" height="3px"></svg>
                    <svg viewBox="0 0 256 256">
                      <defs></defs>
                      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                        <path
                          d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
                          transform=" matrix(1 0 0 1 0 0) "
                          stroke-linecap="round"
                        />
                      </g>
                    </svg>
                    <svg width="6px" height="3px"></svg>
                  </div>
                </button>

                {/* created date */}
                <button
                  title="Ascending ordering by Creation Date"
                  type="button"
                  value="creationdate"
                  onClick={orderByCreation}
                  className="flex items-center gap-[10px] max-w-[105px] w-full"
                >
                  Creation Date
                  <div className="max-w-[5px] w-full ">
                    <svg viewBox="0 0 256 256">
                      <defs></defs>
                      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                        <path
                          d="M 90 65.75 c 0 0.896 -0.342 1.792 -1.025 2.475 c -1.366 1.367 -3.583 1.367 -4.949 0 L 45 29.2 L 5.975 68.225 c -1.367 1.367 -3.583 1.367 -4.95 0 c -1.366 -1.367 -1.366 -3.583 0 -4.95 l 41.5 -41.5 c 1.366 -1.367 3.583 -1.367 4.949 0 l 41.5 41.5 C 89.658 63.958 90 64.854 90 65.75 z"
                          transform=" matrix(1 0 0 1 0 0) "
                          stroke-linecap="round"
                        />
                      </g>
                    </svg>{" "}
                    <svg width="6px" height="3px"></svg>
                    <svg viewBox="0 0 256 256">
                      <defs></defs>
                      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                        <path
                          d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
                          transform=" matrix(1 0 0 1 0 0) "
                          stroke-linecap="round"
                        />
                      </g>
                    </svg>
                    <svg width="6px" height="3px"></svg>
                  </div>
                </button>
              </div>
              <div className="flex items-center gap-[150px] pr-[25px]">
                {/* team */}
                <li className="flex items-center gap-[10px]">
                  <button
                    title="Ascending ordering by Team"
                    type="button"
                    value="team-size/asc"
                  >
                    Team
                  </button>
                  <button
                    title="Ascending ordering by Team"
                    type="button"
                    value="team-size/asc"
                  >
                    <svg viewBox="0 0 256 256">
                      <defs></defs>
                      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                        <path
                          d="M 90 65.75 c 0 0.896 -0.342 1.792 -1.025 2.475 c -1.366 1.367 -3.583 1.367 -4.949 0 L 45 29.2 L 5.975 68.225 c -1.367 1.367 -3.583 1.367 -4.95 0 c -1.366 -1.367 -1.366 -3.583 0 -4.95 l 41.5 -41.5 c 1.366 -1.367 3.583 -1.367 4.949 0 l 41.5 41.5 C 89.658 63.958 90 64.854 90 65.75 z"
                          transform=" matrix(1 0 0 1 0 0) "
                          stroke-linecap="round"
                        />
                      </g>
                    </svg>{" "}
                    <svg width="6px" height="3px"></svg>
                    <svg viewBox="0 0 256 256">
                      <defs></defs>
                      <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                        <path
                          d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
                          transform=" matrix(1 0 0 1 0 0) "
                          stroke-linecap="round"
                        />
                      </g>
                    </svg>
                    <svg width="6px" height="3px"></svg>
                  </button>
                </li>
                {/* actions */}
                <li>
                  <span>Actions</span>
                  <div></div>
                </li>
              </div>
            </ul>
            {projects.map((item, id) => (
              <div
                key={id}
                className="max-w-[1354px] w-full p-[10px] border-b border-[#e6e9ed]  flex"
              >
                <Link
                  href={`/projects/edit?id=${item._id}`}
                  className="flex items-center gap-[30px] w-full"
                >
                  <div class="project_icon bg-[#c2c7cd] max-w-[40px] w-full flex justify-center items-center p-2 rounded-[50%]">
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
                      created on {formatDate(item.createdAt)}
                    </p>
                  </div>
                </Link>

                <div className="max-w-[250px] w-full flex justify-between ">
                  {/* team members */}
                  <div className="max-w-[50px] w-full flex items-center gap-1 text-[14px] text-[#404040]">
                    <svg width="15px" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15.8 21C15.8 21.3866 16.1134 21.7 16.5 21.7C16.8866 21.7 17.2 21.3866 17.2 21H15.8ZM4.8 21C4.8 21.3866 5.1134 21.7 5.5 21.7C5.8866 21.7 6.2 21.3866 6.2 21H4.8ZM6.2 18C6.2 17.6134 5.8866 17.3 5.5 17.3C5.1134 17.3 4.8 17.6134 4.8 18H6.2ZM12.3 21C12.3 21.3866 12.6134 21.7 13 21.7C13.3866 21.7 13.7 21.3866 13.7 21H12.3ZM13.7 18C13.7 17.6134 13.3866 17.3 13 17.3C12.6134 17.3 12.3 17.6134 12.3 18H13.7ZM11.7429 11.3125L11.3499 10.7333L11.3499 10.7333L11.7429 11.3125ZM16.2429 11.3125L15.8499 10.7333L15.8499 10.7333L16.2429 11.3125ZM3.2 21V19.5H1.8V21H3.2ZM8 14.7H11V13.3H8V14.7ZM15.8 19.5V21H17.2V19.5H15.8ZM11 14.7C13.651 14.7 15.8 16.849 15.8 19.5H17.2C17.2 16.0758 14.4242 13.3 11 13.3V14.7ZM3.2 19.5C3.2 16.849 5.34903 14.7 8 14.7V13.3C4.57583 13.3 1.8 16.0758 1.8 19.5H3.2ZM11 14.7H15.5V13.3H11V14.7ZM20.3 19.5V21H21.7V19.5H20.3ZM15.5 14.7C18.151 14.7 20.3 16.849 20.3 19.5H21.7C21.7 16.0758 18.9242 13.3 15.5 13.3V14.7ZM6.2 21V18H4.8V21H6.2ZM13.7 21V18H12.3V21H13.7ZM9.5 11.3C7.67746 11.3 6.2 9.82255 6.2 8.00001H4.8C4.8 10.5958 6.90426 12.7 9.5 12.7V11.3ZM6.2 8.00001C6.2 6.17746 7.67746 4.7 9.5 4.7V3.3C6.90426 3.3 4.8 5.40427 4.8 8.00001H6.2ZM9.5 4.7C11.3225 4.7 12.8 6.17746 12.8 8.00001H14.2C14.2 5.40427 12.0957 3.3 9.5 3.3V4.7ZM12.8 8.00001C12.8 9.13616 12.2264 10.1386 11.3499 10.7333L12.1358 11.8918C13.3801 11.0477 14.2 9.61973 14.2 8.00001H12.8ZM11.3499 10.7333C10.8225 11.091 10.1867 11.3 9.5 11.3V12.7C10.4757 12.7 11.3839 12.4019 12.1358 11.8918L11.3499 10.7333ZM14 4.7C15.8225 4.7 17.3 6.17746 17.3 8.00001H18.7C18.7 5.40427 16.5957 3.3 14 3.3V4.7ZM17.3 8.00001C17.3 9.13616 16.7264 10.1386 15.8499 10.7333L16.6358 11.8918C17.8801 11.0477 18.7 9.61973 18.7 8.00001H17.3ZM15.8499 10.7333C15.3225 11.091 14.6867 11.3 14 11.3V12.7C14.9757 12.7 15.8839 12.4019 16.6358 11.8918L15.8499 10.7333ZM11.9378 5.42349C12.5029 4.97049 13.2189 4.7 14 4.7V3.3C12.8892 3.3 11.8667 3.68622 11.0622 4.33114L11.9378 5.42349ZM14 11.3C13.3133 11.3 12.6775 11.091 12.1501 10.7333L11.3642 11.8918C12.1161 12.4019 13.0243 12.7 14 12.7V11.3Z"
                        fill="#c2c7cd"
                      />
                    </svg>
                    {item.teamMembers.length > 0
                      ? `${item.teamMembers.length}`
                      : "0"}
                  </div>
                  <div className="max-w-[80px] w-full flex justify-center">
                    <div className="relative">
                      <button
                        onClick={() => handleActions(item._id)}
                        className={`${
                          activeAction === item._id &&
                          "bg-gray-200 outline-none"
                        } p-2 rounded-full `}
                      >
                        <svg
                          fill="#000000"
                          height="20px"
                          width="20px"
                          viewBox="0 0 32.055 32.055"
                        >
                          <g>
                            <path
                              d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967
		                         C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967
		                          s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967
		                          c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"
                            />
                          </g>
                        </svg>
                      </button>

                      {activeAction === item._id && (
                        <div
                          className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20"
                          ref={actionRef}
                        >
                          <ul className="py-1">
                            <Link
                              href={`/projects/edit?id=${item._id}`}
                              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/reports`}
                              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                            >
                              View Report
                            </Link>
                            <button
                              onClick={() => handleArchive(item._id)}
                              className=" w-full text-gray-700  px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer items-start flex"
                            >
                              Archive
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600  px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer w-full  items-start flex "
                            >
                              Delete
                            </button>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {projects.length === 0 && tab == "active" && (
          <div className="w-full flex flex-col items-center justify-center h-[75vh]">
            <ActiveProjects />

            <div className="max-w-[448px] w-full text-center">
              <h1 className="mt-[80px] text-[16px] leading-[24px] font-[700] text-[#575757]">
                Welcome to TechTracker!
              </h1>
              <p className="mt-[20px]">
                To get started, the desktop application and to start tracking
                your work. If you have any questions, don't hesitate.
              </p>
            </div>
          </div>
        )}
        {tab == "archive" && (
          <div>
            {archiveProjects.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center h-[75vh]">
                <div className="w-full flex flex-col items-center justify-center h-[75vh]">
                  <ArchiveProjects />

                  <div className="max-w-[408px] w-full text-center">
                    <p className="mt-[20px]">
                      You don’t have any archived projects yet
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <ul class=" flex justify-between text-[14px] pl-[10px] text-gray-400 mt-[40px] pb-[15px]  border-b border-[#e6e9ed]">
                <div className="flex items-center  w-full gap-[30px]">
                  {/* name */}

                  <button
                    title="Ascending ordering by Name"
                    type="button"
                    value="projectname"
                    className="flex items-center gap-[10px]"
                    onClick={orderByName}
                  >
                    Name
                    <div className="max-w-[8px] w-full ">
                      {" "}
                      <svg viewBox="0 0 256 256">
                        <defs></defs>
                        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                          <path
                            d="M 90 65.75 c 0 0.896 -0.342 1.792 -1.025 2.475 c -1.366 1.367 -3.583 1.367 -4.949 0 L 45 29.2 L 5.975 68.225 c -1.367 1.367 -3.583 1.367 -4.95 0 c -1.366 -1.367 -1.366 -3.583 0 -4.95 l 41.5 -41.5 c 1.366 -1.367 3.583 -1.367 4.949 0 l 41.5 41.5 C 89.658 63.958 90 64.854 90 65.75 z"
                            transform=" matrix(1 0 0 1 0 0) "
                            stroke-linecap="round"
                          />
                        </g>
                      </svg>{" "}
                      <svg width="6px" height="3px"></svg>
                      <svg viewBox="0 0 256 256">
                        <defs></defs>
                        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                          <path
                            d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
                            transform=" matrix(1 0 0 1 0 0) "
                            stroke-linecap="round"
                          />
                        </g>
                      </svg>
                      <svg width="6px" height="3px"></svg>
                    </div>
                  </button>

                  {/* created date */}
                  <button
                    title="Ascending ordering by Creation Date"
                    type="button"
                    value="creationdate"
                    onClick={orderByCreation}
                    className="flex items-center gap-[10px] max-w-[105px] w-full"
                  >
                    Creation Date
                    <div className="max-w-[5px] w-full ">
                      <svg viewBox="0 0 256 256">
                        <defs></defs>
                        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                          <path
                            d="M 90 65.75 c 0 0.896 -0.342 1.792 -1.025 2.475 c -1.366 1.367 -3.583 1.367 -4.949 0 L 45 29.2 L 5.975 68.225 c -1.367 1.367 -3.583 1.367 -4.95 0 c -1.366 -1.367 -1.366 -3.583 0 -4.95 l 41.5 -41.5 c 1.366 -1.367 3.583 -1.367 4.949 0 l 41.5 41.5 C 89.658 63.958 90 64.854 90 65.75 z"
                            transform=" matrix(1 0 0 1 0 0) "
                            stroke-linecap="round"
                          />
                        </g>
                      </svg>{" "}
                      <svg width="6px" height="3px"></svg>
                      <svg viewBox="0 0 256 256">
                        <defs></defs>
                        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                          <path
                            d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
                            transform=" matrix(1 0 0 1 0 0) "
                            stroke-linecap="round"
                          />
                        </g>
                      </svg>
                      <svg width="6px" height="3px"></svg>
                    </div>
                  </button>
                </div>
                <div className="flex items-center gap-[150px] pr-[25px]">
                  {/* team */}
                  <li className="flex items-center gap-[10px]">
                    <button
                      title="Ascending ordering by Team"
                      type="button"
                      value="team-size/asc"
                    >
                      Team
                    </button>
                    <button
                      title="Ascending ordering by Team"
                      type="button"
                      value="team-size/asc"
                    >
                      <svg viewBox="0 0 256 256">
                        <defs></defs>
                        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                          <path
                            d="M 90 65.75 c 0 0.896 -0.342 1.792 -1.025 2.475 c -1.366 1.367 -3.583 1.367 -4.949 0 L 45 29.2 L 5.975 68.225 c -1.367 1.367 -3.583 1.367 -4.95 0 c -1.366 -1.367 -1.366 -3.583 0 -4.95 l 41.5 -41.5 c 1.366 -1.367 3.583 -1.367 4.949 0 l 41.5 41.5 C 89.658 63.958 90 64.854 90 65.75 z"
                            transform=" matrix(1 0 0 1 0 0) "
                            stroke-linecap="round"
                          />
                        </g>
                      </svg>{" "}
                      <svg width="6px" height="3px"></svg>
                      <svg viewBox="0 0 256 256">
                        <defs></defs>
                        <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                          <path
                            d="M 90 24.25 c 0 -0.896 -0.342 -1.792 -1.025 -2.475 c -1.366 -1.367 -3.583 -1.367 -4.949 0 L 45 60.8 L 5.975 21.775 c -1.367 -1.367 -3.583 -1.367 -4.95 0 c -1.366 1.367 -1.366 3.583 0 4.95 l 41.5 41.5 c 1.366 1.367 3.583 1.367 4.949 0 l 41.5 -41.5 C 89.658 26.042 90 25.146 90 24.25 z"
                            transform=" matrix(1 0 0 1 0 0) "
                            stroke-linecap="round"
                          />
                        </g>
                      </svg>
                      <svg width="6px" height="3px"></svg>
                    </button>
                  </li>
                  {/* actions */}
                  <li>
                    <span>Actions</span>
                    <div></div>
                  </li>
                </div>
              </ul>
            )}

            {archiveProjects?.map((item, id) => (
              <div
                key={id}
                className="max-w-[1354px] w-full p-[10px] border-b border-[#e6e9ed]  flex"
              >
                <Link
                  href={`/projects/edit?id=${item._id}`}
                  className="flex items-center gap-[30px] w-full"
                >
                  <div class="project_icon bg-[#c2c7cd] max-w-[40px] w-full flex justify-center items-center p-2 rounded-[50%]">
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
                      created on {formatDate(item.createdAt)}
                    </p>
                  </div>
                </Link>

                <div className="max-w-[250px] w-full flex justify-between ">
                  {/* team members */}
                  <div className="max-w-[50px] w-full flex items-center gap-1 text-[14px] text-[#404040]">
                    <svg width="15px" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15.8 21C15.8 21.3866 16.1134 21.7 16.5 21.7C16.8866 21.7 17.2 21.3866 17.2 21H15.8ZM4.8 21C4.8 21.3866 5.1134 21.7 5.5 21.7C5.8866 21.7 6.2 21.3866 6.2 21H4.8ZM6.2 18C6.2 17.6134 5.8866 17.3 5.5 17.3C5.1134 17.3 4.8 17.6134 4.8 18H6.2ZM12.3 21C12.3 21.3866 12.6134 21.7 13 21.7C13.3866 21.7 13.7 21.3866 13.7 21H12.3ZM13.7 18C13.7 17.6134 13.3866 17.3 13 17.3C12.6134 17.3 12.3 17.6134 12.3 18H13.7ZM11.7429 11.3125L11.3499 10.7333L11.3499 10.7333L11.7429 11.3125ZM16.2429 11.3125L15.8499 10.7333L15.8499 10.7333L16.2429 11.3125ZM3.2 21V19.5H1.8V21H3.2ZM8 14.7H11V13.3H8V14.7ZM15.8 19.5V21H17.2V19.5H15.8ZM11 14.7C13.651 14.7 15.8 16.849 15.8 19.5H17.2C17.2 16.0758 14.4242 13.3 11 13.3V14.7ZM3.2 19.5C3.2 16.849 5.34903 14.7 8 14.7V13.3C4.57583 13.3 1.8 16.0758 1.8 19.5H3.2ZM11 14.7H15.5V13.3H11V14.7ZM20.3 19.5V21H21.7V19.5H20.3ZM15.5 14.7C18.151 14.7 20.3 16.849 20.3 19.5H21.7C21.7 16.0758 18.9242 13.3 15.5 13.3V14.7ZM6.2 21V18H4.8V21H6.2ZM13.7 21V18H12.3V21H13.7ZM9.5 11.3C7.67746 11.3 6.2 9.82255 6.2 8.00001H4.8C4.8 10.5958 6.90426 12.7 9.5 12.7V11.3ZM6.2 8.00001C6.2 6.17746 7.67746 4.7 9.5 4.7V3.3C6.90426 3.3 4.8 5.40427 4.8 8.00001H6.2ZM9.5 4.7C11.3225 4.7 12.8 6.17746 12.8 8.00001H14.2C14.2 5.40427 12.0957 3.3 9.5 3.3V4.7ZM12.8 8.00001C12.8 9.13616 12.2264 10.1386 11.3499 10.7333L12.1358 11.8918C13.3801 11.0477 14.2 9.61973 14.2 8.00001H12.8ZM11.3499 10.7333C10.8225 11.091 10.1867 11.3 9.5 11.3V12.7C10.4757 12.7 11.3839 12.4019 12.1358 11.8918L11.3499 10.7333ZM14 4.7C15.8225 4.7 17.3 6.17746 17.3 8.00001H18.7C18.7 5.40427 16.5957 3.3 14 3.3V4.7ZM17.3 8.00001C17.3 9.13616 16.7264 10.1386 15.8499 10.7333L16.6358 11.8918C17.8801 11.0477 18.7 9.61973 18.7 8.00001H17.3ZM15.8499 10.7333C15.3225 11.091 14.6867 11.3 14 11.3V12.7C14.9757 12.7 15.8839 12.4019 16.6358 11.8918L15.8499 10.7333ZM11.9378 5.42349C12.5029 4.97049 13.2189 4.7 14 4.7V3.3C12.8892 3.3 11.8667 3.68622 11.0622 4.33114L11.9378 5.42349ZM14 11.3C13.3133 11.3 12.6775 11.091 12.1501 10.7333L11.3642 11.8918C12.1161 12.4019 13.0243 12.7 14 12.7V11.3Z"
                        fill="#c2c7cd"
                      />
                    </svg>
                    {item.teamMembers.length > 0
                      ? `${item.teamMembers.length}`
                      : "0"}
                  </div>
                  <div className="max-w-[80px] w-full flex justify-center">
                    <div className="relative">
                      <button
                        onClick={() => handleActions(item._id)}
                        className={`${
                          activeAction === item._id &&
                          "bg-gray-200 outline-none"
                        } p-2 rounded-full `}
                      >
                        <svg
                          fill="#000000"
                          height="20px"
                          width="20px"
                          viewBox="0 0 32.055 32.055"
                        >
                          <g>
                            <path
                              d="M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967
                                 C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967
                                  s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967
                                  c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z"
                            />
                          </g>
                        </svg>
                      </button>

                      {activeAction === item._id && (
                        <div
                          className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20"
                          ref={actionRef}
                        >
                          <ul className="py-1">
                            <button
                              onClick={() => handleArchive(item._id)}
                              className=" w-full text-gray-700  px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer items-start flex"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 w-full  px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer items-start flex"
                            >
                              Delete
                            </button>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectListPage;
