import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("projectState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Failed to load state from localStorage:", err);
    return undefined;
  }
};

const saveStateToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("projectState", serializedState);
  } catch (err) {
    console.error("Failed to save state to localStorage:", err);
  }
};

const initializeState = () => {
  const loadedState = loadStateFromLocalStorage();
  if (loadedState) {
    return {
      ...loadedState,
      teamMembers: loadedState.teamMembers || [
        { id: uuidv4(), name: "", email: "", role: "worker" },
      ],
      currentStep: loadedState.currentStep || "general",
      projectName: loadedState.projectName || "",
      projects: loadedState.projects || [],
      currentProjectId: loadedState.currentProjectId || null,
    };
  }
  return {
    currentStep: "general",
    projectName: "",
    teamMembers: [{ id: uuidv4(), name: "", email: "", role: "worker" }],
    projects: [],
    currentProjectId: null,
  };
};

const initialState = initializeState();

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setCurrentStep(state, action) {
      state.currentStep = action.payload;
      saveStateToLocalStorage(state);
    },
    setProjectName(state, action) {
      state.projectName = action.payload;
      saveStateToLocalStorage(state);
    },
    addTeamMember(state, action) {
      if (state.currentProjectId && typeof action.payload === "object") {
        const project = state.projects.find(
          (project) => project.id === state.currentProjectId
        );
        if (project) {
          project.teamMembers.push(action.payload);
          saveStateToLocalStorage(state);
        }
      } else {
        state.teamMembers.push(action.payload);
        saveStateToLocalStorage(state);
      }
    },
    setTeamMembers(state, action) {
      state.teamMembers = action.payload;
    },
    addProject(state, action) {
      const existingProjectIndex = state.projects.findIndex(
        (project) => project.name === action.payload.projectName
      );
      if (existingProjectIndex > -1) {
        state.projects[existingProjectIndex] = {
          ...state.projects[existingProjectIndex],
          ...action.payload,
        };
        state.currentProjectId = state.projects[existingProjectIndex].id;
      } else {
        const newProject = { ...action.payload, id: uuidv4(), teamMembers: [] };
        state.projects.push(newProject);
        state.currentProjectId = newProject.id;
      }
      saveStateToLocalStorage(state);
    },
    resetProject(state) {
      state.currentStep = "general";
      state.projectName = "";
      state.teamMembers = [
        { id: uuidv4(), name: "", email: "", role: "worker" },
      ];
      state.currentProjectId = null;
      saveStateToLocalStorage(state);
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
} = projectSlice.actions;

export default projectSlice.reducer;
