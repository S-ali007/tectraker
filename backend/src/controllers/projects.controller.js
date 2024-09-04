const Project = require("../models/todos/projects.models");
const Team = require("../models/todos/team.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const createProject = asyncHandler(async (req, res) => {
  try {
    const { name, teamMembers } = req.body;
    const userId = req.user._id;

    const project = await Project.create({
      name,
      teamMembers,
      owner_id: userId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, { project }, "Project Created Successfully"));
  } catch (error) {
    console.log(error, "error");
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

const getAllProjects = asyncHandler(async (req, res) => {
  try {
    const { sortBy, sortOrder, tab } = req.query;
    const userId = req.user._id;

    let sortCriteria = {};
    if (sortBy === "name" || sortBy === "created_at") {
      sortCriteria[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    let filter = {
      owner_id: userId,
    };

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

const getProjectById = asyncHandler(async (req, res) => {
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
});

const updateProject = asyncHandler(async (req, res) => {
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
});

const addTeamMembers = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { teamMembers } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    const newTeamMembers = await Team.insertMany(
      teamMembers.map((member) => ({ ...member, project_id: id }))
    );

    project.teamMembers.push(...newTeamMembers.map((member) => member._id));

    await project.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, { project }, "Team Members added successfully")
      );
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json(new ApiError(400, {}, "Duplicate team member detected"));
    } else {
      res.status(500).json(new ApiError(500, "Server error"));
    }
  }
});

const updateTeamMembers = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { teamMembers } = req.body;
    const project = await Team.findById(id);

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
});

const deleteProject = asyncHandler(async (req, res) => {
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
});

const archiveProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    project.isArchived = !project.isArchived;
    await project.save();

    res
      .status(200)
      .json(new ApiResponse(200, { project }, "Project Archived Successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

const addTimeEntry = asyncHandler(async (req, res) => {
  try {
    const { user_id, task_name, start_time, end_time } = req.body;
    const project = await Project.findById(user_id);
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    const duration = end_time
      ? (new Date(end_time) - new Date(start_time)) / 1000
      : null;

    project.timeEntries.push({
      user_id,
      task_name,
      start_time,
      end_time,
      duration,
    });

    await project.save();

    res
      .status(200)
      .json(new ApiResponse(200, { project }, "Time Entry Added Successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

const getTimeEntries = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).select("timeEntries");
    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { timeEntries: project.timeEntries },
          "Time Entries Retrieved Successfully"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMembers,
  updateTeamMembers,
  archiveProject,
  addTimeEntry,
  getTimeEntries,
};
