const { Router } = require("express");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateTeamMembers,
  archiveProject,
  addTimeEntry,
  getTimeEntries,
  addTeamMembers,
  deleteTask,
  updateTask,
} = require("../controllers/projects.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

const router = Router();

router.route("/").post(verifyJwt, createProject);

router.get("/projects", verifyJwt, getAllProjects);
router.get("/user/my-activites", verifyJwt, getTimeEntries);
router.delete("/user/:id/my-activites", verifyJwt, deleteTask);
router.put("/user/:id/my-activites", verifyJwt, updateTask);

router
  .route("/:id")
  .get(verifyJwt, getProjectById)
  .put(verifyJwt, updateProject)
  .delete(verifyJwt, deleteProject);

router.post("/:id/team-members", verifyJwt, addTeamMembers);
router.put("/:id/team-members", verifyJwt, updateTeamMembers);

router.put("/:id/archive", verifyJwt, archiveProject);

router.post("/:id/time-entries", verifyJwt, addTimeEntry);

module.exports = router;
