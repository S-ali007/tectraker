"use client";
import Reports from "@/assets/icons/Reports";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setAllProjects } from "@/app/features/projectSlice";
import api from "@/api";
import BarChart from "@/app/components/BarChart";
import DropdownDatePicker from "@/app/components/common/DateCalender";
import SelectButton from "@/app/components/common/SelectProjectsBtn";

function Page() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const sortBy = searchParams.get("sort-by") || "name";
  const sortOrder = searchParams.get("sort-order") || "asc";
  const startQuery = startDate.toLocaleDateString("en-GB");
  const endQuery = endDate.toLocaleDateString("en-GB");
  const { projects, selectedProjects } = useSelector((state) => state.project);

  const formatDateRoute = (dateString) => {
    return dateString.toLocaleDateString("en-GB");
  };

  const handleDatechange = async (date) => {
    const newStartDate = await formatDateRoute(date);
    localStorage?.setItem("startQuery", newStartDate);
    router.push(
      `/reports?start=${newStartDate}&end=${endQuery}&projects=${
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
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [sortBy, sortOrder, dispatch, router]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const handleSelectProjects = () => {
    console.log("Button Clicked!");
  };

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

            <SelectButton
              onButtonClick={handleSelectProjects}
              buttonText="Select a Project"
              selectedCount={selectedProjects.length}
              icon={
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
              }
            />
            <DropdownDatePicker onDateChange={handleDatechange} />
          </div>
          <BarChart />
        </div>
      )}
    </div>
  );
}

export default Page;
