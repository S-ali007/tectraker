const Project = require("../models/todos/projects.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const createProject = asyncHandler(async (req, res) => {
  try {
    const { name, teamMembers } = req.body;
    const project = await Project.create({ name, teamMembers });
    return res
      .status(200)
      .json(new ApiResponse(200, { project }, "Project Created Successfully"));
  } catch (error) {
    console.log(error, "error");
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

const getAllProjects = asyncHandler(async (req, res) => {
  try {
    const { sortBy, sortOrder, tab } = req.query;

    let sortCriteria = {};
    if (sortBy === "name" || sortBy === "created_at") {
      sortCriteria[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    let filter = {};
    if (tab === "archive") {
      filter.isArchived = true;
    } else if (tab === "active") {
      filter.isArchived = false;
    }

    const projects = await Project.find(filter).sort(sortCriteria);

    res.status(200).json(projects);
  } catch (error) {
    console.log("Error fetching projects:", error);
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, { project }, "Project Retrieved Successfully")
      );
  } catch (error) {
    console.log(error, "error");
    res.status(500).json(new ApiError(500, "Server error"));
  }
};

const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json(new ApiError(400, error.message));
  }
};

const updateTeamMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamMembers } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    project.teamMembers = teamMembers;
    await project.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, { project }, "Team Members Updated Successfully")
      );
  } catch (error) {
    res.status(500).json(new ApiError(500, "Server error"));
  }
};

const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Project Deleted Successfully"));
  } catch (error) {
    res.status(400).json(new ApiError(400, error.message));
  }
};

const archiveProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    project.isArchived = true;
    await project.save();

    res
      .status(200)
      .json(new ApiResponse(200, { project }, "Project Archived Successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateTeamMembers,
  archiveProject,
};
