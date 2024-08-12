"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetProject,
  setCurrentStep,
  setProjectName,
  addProject,
  setTeamMembers,
} from "@/app/features/projectSlice";
import { useRouter, useSearchParams } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import api from "@/api";
import toast, { Toaster } from "react-hot-toast";

const ProjectPage = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const tab = searchParams.get("step") || "general";
  const steps = [{ step: "general" }, { step: "invite-team" }];
  const dispatch = useDispatch();
  const { projectName, teamMembers } = useSelector((state) => state.project);
  const [emailError, setEmailError] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (projectId) {
        try {
          const data = JSON.parse(localStorage.getItem("userData"));
          const token = data?.accessToken;
          const response = await api.get(`/api/v1/project/${projectId}`, {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          });

          if (response.data && response.data.data) {
            const projectNameFromApi = response.data.data.project.name;
            dispatch(setProjectName(projectNameFromApi));
          }
        } catch (error) {
          console.error("Failed to fetch project details", error);
          toast.error(error, "Failed to load project details");
        }
      } else {
        const storedProjectName = localStorage.getItem("user");
        if (storedProjectName) {
          dispatch(resetProject());
        }
      }
    };

    fetchProjectDetails();
  }, [dispatch, projectId]);

  const handleProjectNameChange = (e) => {
    dispatch(setProjectName(e.target.value));
  };

  const handleNext = async () => {
    if (tab === "general" && projectName.trim()) {
      localStorage.setItem("user", projectName);
      const data = JSON.parse(localStorage.getItem("userData"));
      const token = data?.accessToken;

      if (!projectId) {
        dispatch(setCurrentStep("invite-team"));
        try {
          const response = await api.post(
            "/api/v1/project/",
            { name: projectName },
            {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );

          if (response) {
            const newProjectId = response.data.data.project._id;
            dispatch(addProject({ projectName, id: newProjectId }));
            toast.success("Project Created Successfully");
            router.push(`/projects/create?id=${newProjectId}&step=invite-team`);
          }
        } catch (error) {
          toast.error(error?.response?.data?.errors || "An error occurred");
        }
      } else {
        handleUpdateProject();
      }
    } else if (tab === "invite-team") {
      handleFinish();
    }
  };

  const handleUpdateProject = async () => {
    const data = JSON.parse(localStorage.getItem("userData"));
    const token = data?.accessToken;

    try {
      const response = await api.put(
        `/api/v1/project/${projectId}`,
        { name: projectName },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        toast.success("Project Updated Successfully");
        dispatch(setCurrentStep("invite-team"));
        router.push(`/projects/edit?id=${projectId}&step=invite-team`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.errors || "An error occurred");
    }
  };

  const handleTeamMemberChange = (index, field, value) => {
    const newTeamMembers = teamMembers.map((member, i) =>
      i === index ? { ...member, [field]: value } : member
    );
    dispatch(setTeamMembers(newTeamMembers));
  };

  const addMoreFields = () => {
    dispatch(
      setTeamMembers([
        ...teamMembers,
        { id: "", name: "", email: "", role: "worker" },
      ])
    );
  };

  const removeMember = (index) => {
    if (teamMembers.length > 1) {
      dispatch(setTeamMembers(teamMembers.filter((_, i) => i !== index)));
    }
  };

  const handleFinish = async () => {
    const hasEmptyFields = teamMembers.some(
      (member) => !member.name || !member.email
    );
    if (hasEmptyFields) {
      setEmailError(true);
      return;
    }

    const data = JSON.parse(localStorage.getItem("userData"));
    const token = data?.accessToken;

    if (!hasEmptyFields) {
      try {
        const response = await api.put(
          `/api/v1/project/${projectId}/team-members`,
          { teamMembers },
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.data) {
          dispatch(
            setTeamMembers(response.data.data.project.teamMembers || [])
          );
        }

        toast.success("Team Members Added Successfully");
        dispatch(resetProject());
        router.push("/projects?tab=active&sortBy=name&sortOrder=asc");
      } catch (error) {
        console.error("Failed to add team members", error);
        toast.error("Failed to add team members");
      }
    }
  };

  const handleCancel = () => {
    dispatch(resetProject());
    router.push("/projects?tab=active&sortBy=name&sortOrder=asc");
  };

  const handleSetting = () => {
    router.push(`/projects/edit?id=${projectId}`);
  };

  return (
    <div className="max-w-[1440px] w-full">
      <div className="w-full bg-[#f3f6fa] px-[50px] py-[32px]">
        <h1 className="text-[21px] leading-[28px] font-[600]">
          {projectId ? "Update Project" : "Start New Project"}
        </h1>
        <h2 className="w-full min-h-6">{projectName}</h2>
        <ol className="ml-[15px] flex max-w-[200px] w-full gap-[40px] text-[15px] leading-[15px] list-decimal mt-[100px]">
          {steps.map((item) => (
            <li
              key={item.step}
              className={`capitalize ${
                item.step === tab ? "opacity-100 font-[600]" : "opacity-50"
              }`}
            >
              {item.step}
            </li>
          ))}
        </ol>
      </div>
      {tab === "general" && (
        <div className="flex items-center mt-4 gap-[20px] px-[50px]">
          <label htmlFor="projectName">Project name</label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={handleProjectNameChange}
            className="border border-gray-300 p-2 mt-2 max-w-[288px] w-full rounded-[10px] outline-none"
          />
        </div>
      )}
      {tab === "invite-team" && (
        <div className="w-full px-[50px] py-[32px] h-[60vh]">
          <h1 className="text-[21px] leading-[28px] font-[600]">
            Invite Team Members
          </h1>
          <p>
            Enter each team member's email address and role. They will receive
            an email invitation to your TopTracker project.
          </p>

          {teamMembers.map((member, index) => {
            return (
              <div
                key={member.id}
                className="flex items-center mt-4 gap-[20px]"
              >
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) =>
                    handleTeamMemberChange(index, "name", e.target.value)
                  }
                  placeholder="Enter team member name"
                  className="border border-gray-300 p-2 mt-2 max-w-[288px] w-full rounded-[10px] outline-none"
                />
                <input
                  type="text"
                  value={member.email}
                  onChange={(e) =>
                    handleTeamMemberChange(index, "email", e.target.value)
                  }
                  placeholder="Enter team member email"
                  className={`border border-gray-300 p-2 mt-2 max-w-[288px] w-full rounded-[10px] outline-none ${
                    emailError ? "border-red-500" : ""
                  }`}
                />
                <select
                  value={member.role}
                  onChange={(e) =>
                    handleTeamMemberChange(index, "role", e.target.value)
                  }
                  className="border border-gray-300 p-2 mt-2 max-w-[118px] w-full rounded-[10px] outline-none"
                >
                  <option value="worker">Worker</option>
                  <option value="supervisor">Supervisor</option>
                </select>
                <svg
                  onClick={() => removeMember(index)}
                  className="cursor-pointer"
                  fill="#000000"
                  height="15px"
                  width="15px"
                  version="1.1"
                  viewBox="0 0 490 490"
                >
                  <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337" />
                </svg>
              </div>
            );
          })}
          {emailError && (
            <p className="text-red-500 text-sm">Email must be valid</p>
          )}
          <button
            onClick={addMoreFields}
            className="text-blue-500 flex max-w-[154px] gap-[10px] text-[13px] leading-[16px] items-center w-full mt-4"
          >
            <span className="font-[700] text-[34px] flex">+</span> Add another
            member
          </button>
        </div>
      )}
      <div
        className={`w-full flex items-end justify-end gap-[40px] px-[30px] flex-col p-[24px] shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)] ${
          tab === "general" ? "mt-[420px]" : ""
        }`}
      >
        <div
          className={`${
            tab === "invite-team" ? "max-w-[500px]" : "max-w-[300px]"
          } w-full gap-[20px] flex`}
        >
          <button
            onClick={handleCancel}
            className="border max-w-[104px] px-[10px] text-[13px] leading-[16px] py-[10px] rounded-[5px] w-full"
          >
            {tab === "general" ? "Cancel" : "Finish Later"}
          </button>
          {tab === "invite-team" && (
            <button
              onClick={handleSetting}
              className="bg-gray-700 opacity-50 hover:opacity-100 border max-w-[204px] px-[10px] text-[13px] leading-[16px] text-[white] py-[10px] rounded-[5px] w-full"
            >
              Back to Project Settings
            </button>
          )}
          <button
            onClick={handleNext}
            className={`bg-[#00C386] max-w-[204px] px-[10px] text-[13px] leading-[16px] py-[10px] rounded-[5px] text-white w-full ${
              projectName === "" ? "opacity-50" : "opacity-100"
            }`}
          >
            {projectId ? "Update and Go To Next" : "Create and Go To Next"}
          </button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ProjectPage;
