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
    if (!user_id || !start_time) {
      return res.status(400).json(new ApiError(400, "Missing required fields"));
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    const duration = end_time
      ? (new Date(end_time) - new Date(start_time)) / 1000
      : null;

    const date = new Date(start_time).toISOString().split("T")[0];

    let dateEntry = project.dates.find((entry) => entry.date === date);

    if (!dateEntry) {
      dateEntry = {
        date,
        total: 0,
        activities: [],
      };
      project.dates.push(dateEntry);
    }

    dateEntry.activities.push({
      user_id,
      task_name,
      start_time,
      end_time,
      duration,
      project_name: project.name,
    });

    await project.save();

    const activities = project.dates
      .filter((dateEntry) => dateEntry.date === date)
      .flatMap((dateEntry) => dateEntry.activities);

    res
      .status(200)
      .json(
        new ApiResponse(200, { activities }, "Time Entry Added Successfully")
      );
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

const getTimeEntries = asyncHandler(async (req, res) => {
  try {
    const { start, end, projects } = req.query;

    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split("/");
      return new Date(`${year}-${month}-${day}`);
    };

    const startDate = parseDate(start);
    const endDate = parseDate(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    endDate.setHours(23, 59, 59, 999);

    const projectIds = projects ? projects.split("-") : [];

    const projectsData = await Project.find(
      {
        _id: { $in: projectIds },
      },
      {
        _id: 1,
        name: 1,
        dates: 1,
      }
    );

    if (!projectsData || projectsData.length === 0) {
      return res.status(404).json(new ApiError(404, "Project not found"));
    }

    const groupedTimeEntries = {};

    projectsData.forEach((project) => {
      project.dates.forEach((dateEntry) => {
        const entryDate = new Date(dateEntry.date).toISOString().split("T")[0];
        if (
          entryDate >= startDate.toISOString().split("T")[0] &&
          entryDate <= endDate.toISOString().split("T")[0]
        ) {
          if (!groupedTimeEntries[entryDate]) {
            groupedTimeEntries[entryDate] = { date: entryDate, activities: [] };
          }

          groupedTimeEntries[entryDate].activities.push({
            ...dateEntry.activities,
          });
        }
      });
    });

    const filterProjects = Object.values(groupedTimeEntries);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { filterProjects },
          "Time Entries Retrieved Successfully"
        )
      );
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    const project = await Project.findOne({ "dates.activities._id": id });

    if (!project) {
      return res.status(404).json(new ApiError(404, "Task not found"));
    }

    const updatedProject = await Project.findOneAndUpdate(
      { "dates.activities._id": id },
      {
        $pull: { "dates.$[].activities": { _id: id } },
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(500).json(new ApiError(500, "Failed to delete task"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedProject, "Task deleted successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json(new ApiError(500, "Server error"));
  }
});

const updateTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      task_name,
      start_date,
      duration,
      worked_from,
      worked_to,
      project_name,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Task ID is required" });
    }

    if (!task_name) {
      return res.status(400).json({ error: "Task name is required" });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { "dates.activities._id": id },
      {
        $set: {
          "dates.$[].activities.$[activity].task_name": task_name,
          // "dates.$[].activities.$[activity].description": description,
          "dates.$[].activities.$[activity].start_time": start_date,
          "dates.$[].activities.$[activity].duration": duration,
          "dates.$[].activities.$[activity].worked_from": worked_from,
          "dates.$[].activities.$[activity].worked_to": worked_to,
        },
      },

      {
        arrayFilters: [{ "activity._id": id }],
        new: true,
      }
    );

    if (!updatedProject) {
      return res.status(404).json(new ApiError(404, "Task not found"));
    }

    if (project_name) {
      updatedProject.name = project_name;
      await updatedProject.save();
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedProject,
          "Task and project updated successfully"
        )
      );
  } catch (error) {
    console.error(error);
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
  deleteTask,
  updateTask,
};
