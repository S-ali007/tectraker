import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: "general",
  projectName: "",
  teamMembers: [{ id: "", name: "", email: "", role: "worker" }],
  projects: [],
  currentProjectId: null,
  archiveProjects: [],
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
    },
    setProjectName(state, action) {
      state.projectName = action.payload;
    },
    addTeamMember(state, action) {
      if (state.currentProjectId && typeof action.payload === "object") {
        const project = state.projects.find(
          (project) => project.id === state.currentProjectId
        );
        if (project) {
          project.teamMembers.push(action.payload);
        }
      } else {
        state.teamMembers.push(action.payload);
      }
    },
    setTeamMembers(state, action) {
      state.teamMembers = action.payload;
    },
    addProject(state, action) {
      const { projectName, id } = action.payload;
      const existingProjectIndex = state.projects.findIndex(
        (project) => project.name === projectName
      );
      if (existingProjectIndex > -1) {
        state.projects[existingProjectIndex] = {
          ...state.projects[existingProjectIndex],
          ...action.payload,
        };
        state.currentProjectId = state.projects[existingProjectIndex].id;
      } else {
        const newProject = { ...action.payload, teamMembers: [] };
        state.projects.push(newProject);
        state.currentProjectId = id;
      }
    },
    resetProject(state) {
      state.currentStep = "general";
      state.projectName = "";
      state.teamMembers = [{ id: "", name: "", email: "", role: "worker" }];
      state.currentProjectId = null;
    },
    setAllProjects(state, action) {
      state.projects = action.payload;
    },
    setAllArchiveProjects(state, action) {
      state.archiveProjects = action.payload;
    },
  },
});

export const {
  setCurrentStep,
  setProjectName,
  addTeamMember,
  setTeamMembers,
  addProject,
  resetProject,
  setAllArchiveProjects,
  setAllProjects,
} = projectSlice.actions;

export default projectSlice.reducer;
