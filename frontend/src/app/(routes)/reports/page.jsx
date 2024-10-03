"use client";
import Reports from "@/assets/icons/Reports";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  setAllProjects,
  setSelectedProjects,
  setTimeEntriesForProject,
} from "@/app/features/projectSlice";
import api from "@/api";
import BarChart from "@/app/components/BarChart";
import DropdownDatePicker from "@/app/components/common/DateCalender";
import SelectButton from "@/app/components/common/SelectProjectsBtn";
import SelectProjectsBtn from "@/app/components/common/SelectProjectsBtn";
import Link from "next/link";

function Page() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [filteredProject, setFilteredProject] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const sortBy = searchParams.get("sort-by") || "name";
  const sortOrder = searchParams.get("sort-order") || "asc";
  const startQuery = startDate.toLocaleDateString("en-GB");
  const endQuery = endDate.toLocaleDateString("en-GB");

  const { projects, selectedProjects, timeEntriesForProjects } = useSelector(
    (state) => state.project
  );
  const tab = searchParams.get("chart");

  const updatedQueryParams = new URLSearchParams(searchParams);
  const allProjects = updatedQueryParams.get("projects");

  const formatDateRoute = (dateString) => {
    return dateString.toLocaleDateString("en-GB");
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
      `/reports?start=${startQuery}&end=${endQuery}&projects=${
        updatedSelectedProjects.length > 0
          ? updatedSelectedProjects.join("-")
          : "none"
      }&chart=${tab}&table=work-summary&grouping=workers`
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
  const handleDeselectSelect = async () => {
    dispatch(
      setSelectedProjects(
        selectedProjects.length === projects.length
          ? []
          : projects.map((project) => project._id)
      )
    );

    router.push(
      `/reports?start=${startQuery}&end=${endQuery}&workers=391694&projects=${
        selectedProjects.length > 0
          ? "none"
          : projects.map((project) => project._id).join("-")
      }&chart=${tab}&table=work-summary&grouping=workers`
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
  const handleDatechange = async (date) => {
    const newStartDate = await formatDateRoute(date);
    localStorage?.setItem("startQuery", newStartDate);
    router.push(
      `/reports?start=${newStartDate}&end=${endQuery}&workers=391694&projects=${
        selectedProjects.length > 0 ? selectedProjects.join("-") : "none"
      }&chart=workers&table=work-summary&grouping=projects`
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
  useEffect(() => {
    const fetchProjects = async () => {
      const token = Cookies.get("accessToken");
      if (!token) return router.push("/login");

      try {
        const response = await api.get(`/api/v1/project/projects`, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (response) {
          dispatch(setAllProjects(response.data));
          console.log(response);
        }
      } catch (error) {
        toast.error(error?.response?.data?.errors || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [sortBy, sortOrder, dispatch, router]);
  useEffect(() => {
    const fetchProjectsWithUrlParams = async () => {
      const token = Cookies.get("accessToken");
      const storedStartQuery = localStorage?.getItem("startQuery");

      if (allProjects === "all") {
        const allProjectIds = projects.map((project) => project._id);
        dispatch(setSelectedProjects(allProjectIds));
        router.push(
          `/reports?start=${storedStartQuery}&end=${endQuery}&projects=${projects
            .map((project) => project._id)
            .join("-")}&chart=projects&table=work-summary&grouping=projects`
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen  w-full flex-col ">
        <img src="/loserr.gif" alt="Loading..." className="w-16 h-16" />
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full px-[50px] py-[32px]">
      <h1 className="text-[21px] leading-[24px] font-[700] text-[#404040]">
        Reports
      </h1>
      {projects.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center h-[75vh]">
          <Reports />
          <div className="max-w-[448px] w-full text-center">
            <p className="mt-[20px]">
              You have no tracked activity to report yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-[20px]">
          <div className="w-full flex justify-between">
            {/* date btn */}

            <SelectProjectsBtn
              projects={projects}
              selectedProjects={selectedProjects}
              toggleProjectSelection={toggleProjectSelection}
              handleDeselectSelect={handleDeselectSelect}
            />
            <DropdownDatePicker onDateChange={handleDatechange} />
          </div>

          <div className="max-w-[694px] w-full   flex gap-[30px] text-[#404040] text-[15px] leading-[15px] font-[600] mt-[30px]">
            <Link
              href={`/reports?start=${startQuery}&end=${endQuery}&workers=391694&projects=${
                selectedProjects.length > 0
                  ? selectedProjects.join("-")
                  : "none"
              }&chart=projects&table=work-summary&grouping=projects`}
              className={`pb-[5px] ${
                tab === "projects" && "border-b-[#004F98] border-b-[2px]"
              }`}
            >
              Projects
            </Link>
            <Link
              href={`/reports?start=${startQuery}&end=${endQuery}&workers=391694&projects=${
                selectedProjects.length > 0
                  ? selectedProjects.join("-")
                  : "none"
              }&chart=workers&table=work-summary&grouping=projects`}
              className={`pb-[5px] ${
                tab === "workers" && "border-b-[#004F98] border-b-[2px]"
              }`}
            >
              Members{" "}
              {/* {archiveProjects.length > 0 ? `(${archiveProjects.length})` : ""} */}
            </Link>
          </div>
          {selectedProjects.length && tab === "projects" ? (
            <BarChart responseData={projects} />
          ) : (
            <div className="relative bg-[#f3f8fc] py-12 mt-[1rem]">
              <div className="mx-auto flex justify-center">
                <Reports />
              </div>
              <div className="absolute bottom-[22px] w-full text-center text-gray-600">
                <p>
                  You don’t have any reports for the selected criteria. Try
                  different filters.
                </p>
              </div>
            </div>
          )}
          {selectedProjects.length && tab === "workers" ? (
            <BarChart responseData={projects} />
          ) : (
            <div className="relative bg-[#f3f8fc] py-12 mt-[1rem]">
              <div className="mx-auto flex justify-center">
                <Reports />
              </div>
              <div className="absolute bottom-[22px] w-full text-center text-gray-600">
                <p>
                  You don’t have any reports for the selected criteria. Try
                  different filters.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
