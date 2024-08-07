const { Router } = require("express");
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projects.controller");
const { verifyJwt } = require("../middlewares/auth.middleware");
const router = Router();

router.route("/").post(verifyJwt, createProject).get(verifyJwt, getAllProjects);

router
  .route("/:id")
  .get(verifyJwt, getProjectById)
  .put(verifyJwt, updateProject)
  .delete(verifyJwt, deleteProject);

module.exports = router;
