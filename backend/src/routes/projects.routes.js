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
} = require("../controllers/projects.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");

const router = Router();

router.route("/").post(verifyJwt, createProject);
router.get("/projects?", verifyJwt, getAllProjects);

router
  .route("/:id")
  .get(verifyJwt, getProjectById)
  .put(verifyJwt, updateProject)
  .delete(verifyJwt, deleteProject);

router.put("/:id/team-members", verifyJwt, updateTeamMembers);
router.put("/:id/archive", verifyJwt, archiveProject);

router.post("/:id/time-entries", addTimeEntry);
router.get("/:id/time-entries", getTimeEntries);

module.exports = router;
