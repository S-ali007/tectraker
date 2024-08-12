const { Router } = require("express");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateTeamMembers,
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

module.exports = router;
